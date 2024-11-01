const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { getResumeById, ping } = require('./resume_controller');
const Resume = require('../models/resume');
const User = require('../models/user');

const app = express();
app.use(express.json());
app.get('/resume/:id', getResumeById);
app.get('/ping', ping);

jest.mock('../models/resume');
jest.mock('../models/user');

describe('Resume Controller', () => {
    describe('GET /resume/:id', () => {
        it('should return 404 if resume not found', async () => {
            Resume.findOne.mockResolvedValue(null);

            const res = await request(app).get('/resume/123');

            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Resume not found');
        });

        it('should return 400 if there is an error', async () => {
            Resume.findOne.mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/resume/123');

            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Database error');
        });

        it('should return the resume if found', async () => {
            const resume = {
                _id: '123',
                fileName: 'resume.pdf',
                fileData: Buffer.from('PDF content'),
                contentType: 'application/pdf',
            };
            Resume.findOne.mockResolvedValue(resume);

            const res = await request(app).get('/resume/123');

            expect(res.status).toBe(200);
            expect(res.header['content-type']).toBe('application/pdf');
            expect(res.header['content-disposition']).toBe('inline; filename=resume.pdf');
            expect(res.body).toEqual(Buffer.from('PDF content'));
        });
    });

    describe('GET /ping', () => {
        it('should return pong', async () => {
            const res = await request(app).get('/ping');

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Pong');
        });
    });
});