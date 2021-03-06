require('dotenv').config();
const path = require('path');
let grpc = require("grpc");
let protoLoader = require("@grpc/proto-loader");
let AuthModule = require("./modules/authModule");
let MediumModule = require("./modules/mediumModule");
let UserModule = require("./modules/userModule");
let db = require("./db")

const server = new grpc.Server();
const HOST = process.env.HOST != undefined ? process.env.HOST : "localhost";
const PORT = process.env.PORT != undefined ? process.env.PORT : "50080";

// Load protobuf
const PROTOPATH = ['authentication.proto','grade.proto','exambroad.proto','user.proto','role.proto','medium.proto'];

let proto = grpc.loadPackageDefinition(
    protoLoader.loadSync(PROTOPATH, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
        includeDirs: [path.join(__dirname, './proto/'), path.join(__dirname, '../node_modules/google-proto-files')]
    })
);
  // Add the implemented methods to the service.
server.addService(proto.abhyaas.AuthenticationService.service, { GetToken: AuthModule.GetToken });
//server.addService(proto.abhyaas.MediumService.service, { GetMedium: MediumModule.GetMedium });
server.addService(proto.abhyaas.UserService.service, {
  CreateUser: UserModule.CreateUser,
  UpdateUser : UserModule.UpdateUser,
  DeleteUser : UserModule.DeleteUser,
  GetUser : UserModule.GetUser,
  ListUsers: UserModule.ListUsers
});

server.bind(`${HOST}:${PORT}`, grpc.ServerCredentials.createInsecure());

server.start();
