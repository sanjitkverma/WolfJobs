
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../../models/user');
const Resume = require('../../../models/resume');
const Application = require('../../../models/application');
const usersApi = require('./users_api');

const app = express();
app.use(express.json());
app.post('/create-application', usersApi.createApplication);

describe('POST /create-application', () => {
    let server;
    let user;
    let token;
    let resume;
    let application;

    beforeAll(async () => {
        server = app.listen(3000);
        mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });

        user = new User({
            email: 'test@example.com',
            password: 'password123',
            name: 'Test User'
        });
        await user.save();

        resume = new Resume({
            applicantId: user._id,
            resumeData: 'Sample Resume Data'
        });
        await resume.save();
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Resume.deleteMany({});
        await Application.deleteMany({});
        await mongoose.connection.close();
        server.close();
    });

    it('should return 400 if the user has already applied for the job', async () => {
        application = new Application({
            applicantid: user._id,
            jobid: 'job123',
            resumeId: resume._id
        });
        await application.save();

        const res = await request(app)
            .post('/create-application')
            .send({
                applicantid: user._id,
                jobid: 'job123'
            });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('You have already applied for the job');
    });

    it('should return 404 if the resume is not found', async () => {
        const res = await request(app)
            .post('/create-application')
            .send({
                applicantid: mongoose.Types.ObjectId(),
                jobid: 'job123'
            });

        expect(res.status).toBe(404);
        expect(res.body.message).toBe('Resume not found in profile');
    });

    it('should create a new application if valid data is provided', async () => {
        const res = await request(app)
            .post('/create-application')
            .send({
                applicantid: user._id,
                applicantname: 'Test User',
                applicantemail: 'test@example.com',
                applicantskills: ['JavaScript', 'Node.js'],
                skills: ['JavaScript', 'Node.js'],
                address: '123 Test St',
                phonenumber: '1234567890',
                hours: 40,
                dob: '1990-01-01',
                gender: 'Male',
                jobname: 'Software Developer',
                jobid: 'job456',
                managerid: 'manager123'
            });

        expect(res.status).toBe(200);
        expect(res.body.data.application).toHaveProperty('_id');
        expect(res.body.data.application.applicantid).toBe(String(user._id));
        expect(res.body.data.application.jobid).toBe('job456');
    });

    it('should return 500 if there is an internal server error', async () => {
        jest.spyOn(Application.prototype, 'save').mockImplementationOnce(() => {
            throw new Error('Internal server error');
        });

        const res = await request(app)
            .post('/create-application')
            .send({
                applicantid: user._id,
                applicantname: 'Test User',
                applicantemail: 'test@example.com',
                applicantskills: ['JavaScript', 'Node.js'],
                skills: ['JavaScript', 'Node.js'],
                address: '123 Test St',
                phonenumber: '1234567890',
                hours: 40,
                dob: '1990-01-01',
                gender: 'Male',
                jobname: 'Software Developer',
                jobid: 'job456',
                managerid: 'manager123'
            });

        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Internal server error');
    });
});