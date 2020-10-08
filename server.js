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
  if (newBooking && validator.validate(request.body.email)) {
    const newId = shortid.generate();
    newBooking.id = newId;
    bookings.push(newBooking);
    response.send("New booking created!");
  } else {
    response.status(400).send("The request body is invalid");
  }
});

//Searches by time and term
app.get("/bookings/search", function (request, response) {
  if (request.query.date) {
    let searchTime = request.query.date;

    const searchedBookings = bookings.filter(
      (booking) =>
        moment(searchTime).isBefore(booking.checkOutDate) &&
        moment(searchTime).isAfter(booking.checkInDate)
    );
    if (searchedBookings.length) {
      response.json(searchedBookings);
    } else {
      response.status(400).send("The request body is invalid");
    }
  }
  console.log(request.query.date);
  console.log(request.query.term);
  if (request.query.term) {
    let searchText = request.query.term;

    const matchedBookings = bookings.filter((booking) =>
      booking.email
        .toUpperCase()
        .includes(
          searchText.toUpperCase() ||
            booking.firstName
              .toUpperCase()
              .includes(
                searchText.toUpperCase() ||
                  booking.surname
                    .toUpperCase()
                    .includes(searchText.toUpperCase())
              )
        )
    );

    if (matchedBookings.length) {
      response.json(matchedBookings);
    } else {
      response.status(400).send("The request body is invalid");
    }
  }
  response.status(400).send("The request body is invalid");
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
  console.log(idToDelete);
  bookings.splice(idToDelete, 1);
  console.log(idToDelete);
  if (idToDelete != -1) {
    response.send(`Booking ${bookingId} has been deleted!`);
  } else response.status(400).send("The request body is invalid");
});

const listener = app.listen(/* process.env.PORT */ 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
