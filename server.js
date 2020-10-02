const express = require("express");
const cors = require("cors");
const moment = require("moment");
const app = express();
var validator = require("email-validator");
const shortid = require("shortid");

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here
console.log(validator.validate("test@email.com"));
console.log(validator.validate("test@email"));
console.log(validator.validate("@email.com"));
//Returns all bookings
app.get("/bookings", function (request, response) {
  response.json(bookings);
});

//Creates a new booking
app.post("/bookings", function (request, response) {
  const newBooking = request.body;
  if (newBooking) {
    const newId = shortid.generate();
    newBooking.id = newId;
    bookings.push(newBooking);
    response.send("New booking created!");
  } else {
    res.status(400).send("The request body is invalid");
  }
});

//Returns a booking by ID
app.get("/bookings/:bookingId", (request, response) => {
  const bookingId = request.params.bookingId;
  const bookingSearched = bookings.filter((booking) => booking.id == bookingId);

  if (bookingSearched.length) response.json(bookingSearched);
  else response.status(400).send("The request body is invalid");
});

//Deletes a booking by ID
app.delete("/bookings/:bookingId", (request, response) => {
  const bookingId = request.params.bookingId;
  const idToDelete = bookings.findIndex((booking) => booking.id == bookingId);
  bookings.splice(idToDelete, 1);
  if (idToDelete.length)
    response.send(`Booking ${bookingId} has been deleted!`);
  else response.status(400).send("The request body is invalid");
});

//Searches by time
app.get("/bookings/search", function (request, response) {
  let searchTime = request.query.date;

  const searchedBookings = bookings.filter(
    (booking) =>
      moment(searchTime).isBefore(booking.checkOutDate) &&
      moment(searchTime).isAfter(booking.checkInDate)
  );

  response.json(searchedBookings);
});

//Searches by text
app.get("/bookings/search", function (request, response) {
  let searchText = request.query.term;
  console.log(searchText);
  const matchedBookings = bookings.filter((booking) =>
    booking.email
      .toUpperCase()
      .includes(
        searchText.toUpperCase() ||
          booking.firstName
            .toUpperCase()
            .includes(
              searchText.toUpperCase() ||
                booking.surname.toUpperCase().includes(searchText.toUpperCase())
            )
      )
  );

  response.json(matchedBookings);
});

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
