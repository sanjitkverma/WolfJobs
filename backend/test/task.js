let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
const sinon = require('sinon');
const emailService = require('../models/email');
const Application = require('../models/application');
const User = require('../models/user');
const required_skills = require('../skills/required_skills');

chai.should();


chai.use(chaiHttp);

describe('Tasks API', () => {

    describe("GET /api/v1/users/fetchapplications" , () => {

        it("IT SHOULD RETURN ALL THE APPLICATIONS" , (done) => {
            // const task = {
            //     email:'shaangzb@gmail.com',
            //     password:'123',
                
            // };

            chai.request('http://localhost:8000')
                .get("/api/v1/users/fetchapplications")
                
                .end((err,response) => {
                    
                    response.body.should.be.a('object');
    
                    console.log('*********',response.body)
                  

                done();

                });
        })

    })

    describe("GET /api/v1/users/" , () => {

        it("IT SHOULD RETURN ALL THE JOBS" , (done) => {
            // const task = {
            //     email:'shaangzb@gmail.com',
            //     password:'123',
                
            // };

            chai.request('http://localhost:8000')
                .get("/api/v1/users/")
                
                .end((err,response) => {
                    
                    response.body.should.be.a('object');
    
                    console.log('*********',response.body)
                  

                done();

                });
        })

    })

    describe("GET /api/v1/users/" , () => {

        it("IT SHOULD RETURN ALL THE JOBS" , (done) => {
            // const task = {
            //     email:'shaangzb@gmail.com',
            //     password:'123',
                
            // };

            chai.request('http://localhost:8000')
                .get("/api/v1/users/")
                
                .end((err,response) => {
                    
                    response.body.should.be.a('object');
    
                    console.log('*********',response.body)
                  

                done();

                });
        })

    })

    describe("POST /api/v1/users/createjob" , () => {

        it("IT SHOULD RETURN THE JOB" , (done) => {
            const body = {
                
                name: 'Shaan',
                managerid: '1234556',
                skills: 'C,java',
                location: 'Noida',
                description: 'xyz',
                pay: '10',
                schedule: '10/10/10',
                
            };

            chai.request('http://localhost:8000')
                .post("/api/v1/users/createjob")
                .send({name: 'Shaan',
                managerid: '1234556',
                skills: 'C,java',
                location: 'Noida',
                description: 'xyz',
                pay: '10',
                schedule: '10/10/10'})
                .end((err,response) => {
                    
                    response.body.should.be.a('object');
    
                    console.log('*********',response.body)
                  

                done();

                });
        })

    })


    describe("GET /api/v1/users/search" , () => {

        it("IT SHOULD RETURN THE SEARCHED JOB" , (done) => {
            const body = {
                
                name: 'Shaan',
                managerid: '1234556',
                skills: 'C,java',
                location: 'Noida',
                description: 'xyz',
                pay: '10',
                schedule: '10/10/10',
                
            };

            chai.request('http://localhost:8000')
                .get("/api/v1/users/search/TA")
                // .send(body)
                .end((err,response) => {
                    
                    response.body.should.be.a('object');
    
                    console.log('*********',response.body.users)
                  

                done();

                });
        })

    })

    describe("POST /api/v1/users/create-session" , () => {

        it("IT SHOULD RETURN THE USER" , (done) => {
            const body = 
                {email:'boss@gmail.com',
                password:'123',
                
        };
            chai.request('http://localhost:8000')
                .post("/api/v1/users/create-session")
                .send(body)
               
                .end((err,response) => {
                    
                    response.body.should.be.a('object');
    
                    console.log('*********',response.body)
                  

                done();

                });
        })

    })

})

//write test cases for the email service feature
describe("Email Service Feature", () => {
    let emailServiceStub;

    beforeEach(() => {
        emailServiceStub = sinon.stub(emailService, 'sendEmail').resolves();
    });

    afterEach(() => {
        emailServiceStub.restore();
    });

    it("IT SHOULD SEND AN EMAIL WHEN STATUS IS 'screening'", async () => {
        const mockApplicationId = "mockApplicationId";
        const applicationStub = sinon.stub(Application, 'findById').returns(Promise.resolve({
            _id: mockApplicationId,
            status: 'screening',
            applicantid: 'mockApplicantId',
            jobname: 'Software Developer',
            save: sinon.stub().returns(Promise.resolve())
        }));

        const userStub = sinon.stub(User, 'findById').returns(Promise.resolve({
            name: 'John Doe',
            email: 'john.doe@example.com'
        }));

        const body = {
            applicationId: mockApplicationId,
            status: 'screening'
        };

        const response = await chai.request('http://localhost:8000')
            .post("/api/v1/users/modifyApplication")
            .send(body);

        response.should.have.status(200);
        sinon.assert.calledOnce(emailServiceStub);
        sinon.assert.calledWith(emailServiceStub, 
            'john.doe@example.com', 
            `Update on your application for Software Developer`, 
            sinon.match.string
        );

        applicationStub.restore();
        userStub.restore();
    });

    it("IT SHOULD SEND AN EMAIL WHEN STATUS IS 'accepted'", async () => {
        const mockApplicationId = "mockApplicationId";
        const applicationStub = sinon.stub(Application, 'findById').returns(Promise.resolve({
            _id: mockApplicationId,
            status: 'screening',
            applicantid: 'mockApplicantId',
            jobname: 'Software Developer',
            save: sinon.stub().returns(Promise.resolve())
        }));

        const userStub = sinon.stub(User, 'findById').returns(Promise.resolve({
            name: 'John Doe',
            email: 'john.doe@example.com'
        }));

        const body = {
            applicationId: mockApplicationId,
            status: 'accepted'
        };

        const response = await chai.request('http://localhost:8000')
            .post("/api/v1/users/modifyApplication")
            .send(body);

        response.should.have.status(200);
        sinon.assert.calledOnce(emailServiceStub);
        sinon.assert.calledWith(emailServiceStub, 
            'john.doe@example.com', 
            `Update on your application for Software Developer`, 
            sinon.match.string
        );

        applicationStub.restore();
        userStub.restore();
    });

    it("IT SHOULD SEND AN EMAIL WHEN STATUS IS 'rejected'", async () => {
        const mockApplicationId = "mockApplicationId";
        const applicationStub = sinon.stub(Application, 'findById').returns(Promise.resolve({
            _id: mockApplicationId,
            status: 'screening',
            applicantid: 'mockApplicantId',
            jobname: 'Software Developer',
            save: sinon.stub().returns(Promise.resolve())
        }));

        const userStub = sinon.stub(User, 'findById').returns(Promise.resolve({
            name: 'John Doe',
            email: 'john.doe@example.com'
        }));

        const body = {
            applicationId: mockApplicationId,
            status: 'rejected'
        };

        const response = await chai.request('http://localhost:8000')
            .post("/api/v1/users/modifyApplication")
            .send(body);

        response.should.have.status(200);
        sinon.assert.calledOnce(emailServiceStub);
        sinon.assert.calledWith(emailServiceStub, 
            'john.doe@example.com', 
            `Update on your application for Software Developer`, 
            sinon.match.string
        );

        applicationStub.restore();
        userStub.restore();
    });

    it("IT SHOULD NOT SEND AN EMAIL FOR NON-NOTIFICATION STATUS", async () => {
        const mockApplicationId = "mockApplicationId";
        const applicationStub = sinon.stub(Application, 'findById').returns(Promise.resolve({
            _id: mockApplicationId,
            status: 'screening',
            applicantid: 'mockApplicantId',
            jobname: 'Software Developer',
            save: sinon.stub().returns(Promise.resolve())
        }));

        const userStub = sinon.stub(User, 'findById').returns(Promise.resolve({
            name: 'John Doe',
            email: 'john.doe@example.com'
        }));

        const body = {
            applicationId: mockApplicationId,
            status: 'grading' // This status should not trigger an email
        };

        const response = await chai.request('http://localhost:8000')
            .post("/api/v1/users/modifyApplication")
            .send(body);

        response.should.have.status(200);
        // Ensure no email was sent
        sinon.assert.notCalled(emailServiceStub);

        applicationStub.restore();
        userStub.restore();
    });

    it("IT SHOULD HANDLE EMAIL SERVICE FAILURE", async () => {
        // generate email service error
        emailServiceStub.rejects(new Error("Email service error"));    
        const applicationStub = sinon.stub(Application, 'findById').returns(Promise.resolve({
            _id: 'mockApplicationId',
            status: 'screening',
            applicantid: 'mockApplicantId',
            jobname: 'Software Developer',
            save: sinon.stub().returns(Promise.resolve())
        }));
    
        const userStub = sinon.stub(User, 'findById').returns(Promise.resolve({
            name: 'John Doe',
            email: 'john.doe@example.com'
        }));
    
        const body = {
            applicationId: 'mockApplicationId',
            status: 'accepted'
        };
    
        const response = await chai.request('http://localhost:8000')
            .post("/api/v1/users/modifyApplication")
            .send(body);
    
        response.should.have.status(500);
        response.body.message.should.equal('Application status updated, but failed to send email notification');
    
        // Restore stubs to avoid side effects on other tests
        applicationStub.restore();
        userStub.restore();
        emailServiceStub.restore();
    });
    
});

//write test cases for fetching the skills API
describe('Skills API', () => {

    let skills;

    // Save original skills so we can restore it after the test
    before(() => {
        skills = required_skills.skills;
    });

    after(() => {
        // Restore original skills
        required_skills.skills = skills;
    });

    describe("GET /api/v1/users/skills", () => {

        it("IT SHOULD RETURN ALL REQUIRED SKILLS", (done) => {
            chai.request('http://localhost:8000')
                .get("/api/v1/users/skills")
                .end((err, response) => {
                    response.should.have.status(200);

                    // Test response structure
                    response.body.should.be.a('array');
                    response.body.length.should.be.above(0);
                    console.log('Skills:', response.body);

                    done();
                });
        });

        it("IT SHOULD RETURN INTERNAL SERVER ERROR IF SKILLS IS UNDEFINED", (done) => {

            //intentionally let the skills dataset be undefined for the sake of the test case
            required_skills.skills = undefined;

            chai.request('http://localhost:8000')
                .get("/api/v1/users/skills")
                .end((err, response) => {
                    response.should.have.status(500);

                    // Check error message
                    response.body.message.should.equal('Internal Server Error');

                    //restore the skills
                    required_skills.skills = skills;
                    done();
                });
        });
    });
});