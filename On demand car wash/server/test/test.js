let chai=require('chai');
let chaiHttp=require('chai-http');

//assertion style
chai.should();

chai.use(chaiHttp);

describe('Packages Api',()=>{

    //get all packages
    describe('GET /api/allpackages',()=>{
        //case 1
        it("It should get all the packages",(done)=>{
            chai.request("http://localhost:3000")
              .get("/api/allpackages")
              .end((err,response)=>{
                response.should.have.status(200);  
                response.body.should.be.a('array');
                done();
            });
        });
        //case 2
        it("It should NOT GET all the packages",(done)=>{
            chai.request("http://localhost:3000")
              .get("/api/package")
              .end((err,response)=>{
                response.should.have.status(404);
                done();
            });
        });
    });

    //get by id
    describe('GET /api/packages/:id',()=>{
        //case 1
        it("It should GET 1 package",(done)=>{
            const testId="5fe0eb92f14be632884cc776"
            chai.request("http://localhost:3000")
              .get("/api/packages/"+testId)
              .end((err,response)=>{
                response.should.have.status(200);  
                response.body.should.be.a('object');
                response.body.should.have.property('_id');
                response.body.should.have.property('name');
                response.body.should.have.property('description');
                response.body.should.have.property('amount');
                done();
            });
        });
        //case 2
        it("It should GET 1 package",(done)=>{
            chai.request("http://localhost:3000")
              .get("/api/package/5fe0eb92f14be632884cc776")
              .end((err,response)=>{
                response.should.have.status(404);  
                done();
            });
        });

    })

    //post 
    describe('POST /api/packages',()=>{
        //case 1
        it("It should POST 1 package",(done)=>{
            const testPackage={
                name: "abc",
                description: "hello",
                amount: 600
            };
            chai.request("http://localhost:3000")
              .post("/api/packages")
              .send(testPackage)
              .end((err,response)=>{
                response.should.have.status(200);  
                response.body.should.be.a('object');
                done();
            });
        });
        //case 2
        it("It should NOT POST the package",(done)=>{
            chai.request("http://localhost:3000")
              .post("/api/package")
              .end((err,response)=>{
                response.should.have.status(404);
                done();
            });
        });
    });

    //patch
    describe('PATCH /api/packages/:id',()=>{
        //case 1
        it("It should UPDATE 1 package",(done)=>{
            const testId="5fe4573a4207c91e48b04624"
            const testPackage={
                amount: 600
            };
            chai.request("http://localhost:3000")
              .patch("/api/updatepackage/"+testId)
              .send(testPackage)
              .end((err,response)=>{
                response.should.have.status(200);  
                response.body.should.be.a('object');
                done();
            });
        });

    })

    //delete
    describe('DELETE /api/deletepackage/:id',()=>{
        //case 1
        it("It should DELETE 1 package",(done)=>{
            chai.request("http://localhost:3000")
              .delete("/api/deletepackage/5fe534407132014938853da5")
              .end((err,response)=>{
                response.should.have.status(200);  
                done();
            });
        });

    })

    
});

describe('Users Api',()=>{
   //get all users
    describe('GET /api/allusers',()=>{
        //case 1
        it("It should get all the users",(done)=>{
            chai.request("http://localhost:3000")
              .get("/api/allusers")
              .end((err,response)=>{
                response.should.have.status(200);  
                response.body.should.be.a('array');
                done();
            });
        });
        //case 2
        it("It should NOT GET all the packages",(done)=>{
            chai.request("http://localhost:3000")
              .get("/api/alluser")
              .end((err,response)=>{
                response.should.have.status(404);
                done();
            });
        });
    });

    //register user
    describe('POST /api/register',()=>{

        it("It should POST 1 user",(done)=>{
            const testUser={
                name:"Harvey Specter",
                email:"specter99@gmail.com",
                password:"harveyS123@"
            }
            chai.request("http://localhost:3000")
              .post("/api/register")
              .send(testUser)
              .end((err,response)=>{
                response.should.have.status(200);
                done();
            });
        });

    })

    
})