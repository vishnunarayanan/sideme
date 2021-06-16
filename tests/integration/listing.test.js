const request = require("supertest");
const mongoose = require("mongoose");

const seedUsers = require("./utils");
const ListingAPI = require("../../datasources/listing-api");
const { User } = require("../../models/user");
const { Listing } = require("../../models/listing");

let app;
describe("Listing Query", () => {
  beforeAll((done) => {
    app = require("../../index");
    async function startUp() {
      await seedUsers();
      done();
    }
    startUp();
  });
  afterAll((done) => {
    async function cleanUp() {
      await User.deleteMany({});
      await Listing.deleteMany({});
      await mongoose.connection.close();
      app.close(() => done());
    }
    cleanUp();
  });

  let token;
  beforeEach(() => {
    token = "676cfd34-e706-4cce-87ca-97f947c43bd4";
  });

  /**
     *  mutation addToFav {
           addToFavorite(mlsId:"1005192" ) {
            mlsId
            favoriteCount
        }
      }
     */
  const exec = () => {
    return request(app)
      .post("/graphql")
      .set("Authorization", "Bearer " + token)
      .send({
        query: 'query { properties(city: "Houston")  { address{city}} }',
      });
  };

  it("should able to filter by city", async () => {
    const res = await exec();
    expect(res.body.data.properties[0].address.city).toBe("Houston");
  });
});
