/*
@ Author Ronald Butron
@ Story Tasks Test
 */
var expect = require('chai').expect;
var methods = require('../../lib/generalLib');
var config = require('../../resources/config.json');
var endPoints = require('../../resources/endPoints.json');
var getToken = require('../../lib/tokenAPI');
var configLog = require('../../resources/crudConfig.json');

/**
 * End point services
 */
var storiesTasksByIdEndPoint = endPoints.projects.storiesTasksByIdEndPoint;
var storiesTasksEndPoint = endPoints.projects.storiesTasksEndPoint;
var projectByIdEndPoint = endPoints.projects.projectByIdEndPoint;
var projectsEndPoint = endPoints.projects.projectsEndPoint;
var storiesEndPoint = endPoints.stories.storiesEndPoint;

/**
 * Variables to be used in the differents tests
 */
var token = null;
var prjId = null;
var storyId = null;
var taskId = null;
var endPoint = null;
var prj = configLog.project.post;
var story = configLog.stories.post;
var taskName = configLog.task.post;
var kind = configLog.task.type;
var status = config.status;
var userCredential = config.userCredential;


describe('Suite Stories Tasks', function() {
    this.timeout(config.timeout);
    before('Get Token', function(done) {
        getToken
            .getToken(userCredential, function(res) {
                expect(res.status).to.equal(status.ok);
                token = res.body.api_token;
                done();

            });
    });

    describe('Suite of Test Post a Task', function() {
        before(function(done) {
            methods
                .post(prj, token, projectsEndPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    prjId = res.body.id;
                    endPoint = storiesEndPoint.replace('{project_id}', prjId);

                    methods
                        .post(story, token, endPoint, function(res) {
                            storyId = res.body.id;
                            endPoint = storiesTasksEndPoint.replace('{project_id}', prjId)
                                .replace('{story_id}', storyId);
                            done();
                        });
                });
        });

        after(function(done) {
            methods
                .del(token, endPoint, function(res) {
                    expect(res.status).to.equal(status.noContent);
                    prjId = null;
                    storyId = null;
                    enPoint = null;
                    done();
                });

        });

        it('POST /projects/{project_id}/stories/{story_id}/tasks', function(done) {

            methods
                .post(taskName, token, endPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body.description).to.equal(taskName.description);
                    expect(res.body.story_id).to.equal(storyId);
                    expect(res.body.complete).to.be.false;
                    endPoint = projectByIdEndPoint.replace('{project_id}', prjId);
                    done();
                });
        });

    });

    describe('Suit Stories Tasks ', function() {

        beforeEach('Creating Pre Conditions.....', function(done) {

            methods
                .post(prj, token, projectsEndPoint, function(res) {
                    prjId = res.body.id;
                    endPoint = storiesEndPoint.replace('{project_id}', prjId);

                    methods
                        .post(story, token, endPoint, function(res) {
                            storyId = res.body.id;
                            endPoint = storiesTasksEndPoint.replace('{project_id}', prjId)
                                .replace('{story_id}', storyId);

                            methods
                                .post(taskName, token, endPoint, function(res) {
                                    taskId = res.body.id;
                                    endPoint = storiesTasksByIdEndPoint.replace('{project_id}', prjId)
                                        .replace('{story_id}', storyId)
                                        .replace('{task_id}', taskId);
                                    done();
                                });
                        });
                });
        });

        afterEach('Deleting project....', function(done) {
            endPoint = projectByIdEndPoint.replace('{project_id}', prjId);
            methods
                .del(token, endPoint, function(res) {
                    expect(res.status).to.equal(status.noContent);
                    prjId = null;
                    storyId = null;
                    enPoint = null;
                    done();
                });
        });

        it('GET /projects/{project_id}/stories/{story_id}/tasks', function(done) {
            endPoint = storiesTasksEndPoint.replace('{project_id}', prjId)
                .replace('{story_id}', storyId);

            methods
                .get(token, endPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body[0].description).to.equal(taskName.description);
                    expect(res.body[0].complete).to.be.false;
                    expect(res.body[0].story_id).to.equal(storyId);
                    expect(res.body[0].kind).to.equal(kind);
                    done();
                });
        });



        it('GET /projects/{project_id}/stories/{story_id}/tasks/{task_id}', function(done) {

            methods
                .get(token, endPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body.description).to.equal(taskName.description);
                    expect(res.body.complete).to.be.false;
                    expect(res.body.story_id).to.equal(storyId);
                    expect(res.body.kind).to.equal(kind);
                    done();
                });
        });

        it('PUT /projects/{project_id}/stories/{story_id}/tasks/{task_id}', function(done) {

            var arg = configLog.task.put;

            methods
                .put(arg, token, endPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body.description).to.equal(arg.description);
                    expect(res.body.complete).to.be.true;
                    expect(res.body.story_id).to.equal(storyId);
                    expect(res.body.kind).to.equal(kind);
                    done();
                });
        });

        it('DELETE /projects/{project_id}/stories/{story_id}/tasks/{task_id}', function(done) {

            methods
                .del(token, endPoint, function(res) {
                    expect(res.status).to.equal(status.noContent);
                    expect(res.body).to.be.empty;
                    done();

                });
        });
    });
});