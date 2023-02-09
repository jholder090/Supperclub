import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  fetchSingleBookingAsync,
  selectSingleBooking,
  editMemberBooking,
  addMemberBookings,
  deleteMemberBooking,
} from "../slices/singleBookingSlice";
import {
  fetchSingleMember,
  selectSingleMember,
} from "../slices/singleMemberSlice";
import {
  Box,
  Button,
  FormControl,
  ImageList,
  ImageListItem,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
} from "@mui/material";

import Payment from "../stripePayment/Payment";

//css
import "./memberBooking.css";

const MemberBooking = ({ user }) => {
  console.log("----USER--->", user, "<---USE----");

  const { bookingId } = useParams();
  const { id } = user;
  const userId = id;
  const [guests, setGuests] = useState("");
  const [payment, setPayment] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("booking id and user id", { bookingId, userId });
    dispatch(fetchSingleBookingAsync(bookingId));
    dispatch(fetchSingleMember(userId));
  }, [dispatch, user]);

  const { booking, error, isLoading } = useSelector(selectSingleBooking);
  console.log("booking ---<>>>", booking);

  const [loginSignUp, setLoginSignup] = useState(false);
  console.log("loginSignup ---->", loginSignUp);

  const { currentMember } = useSelector(selectSingleMember);
  console.log("current member, ", currentMember);

  const memberBookings = booking?.memberBooking;
  console.log("MEMBER BOOKINGS >>>>", memberBookings);
  const memberBooking = memberBookings?.find((member) => member.id == userId);
  console.log("MEMBER BOOKING >>>>>>>>>", memberBooking);
  const reservedSeats = memberBooking?.users_bookings.reservedSeats;
  console.log("RESERVED SEATS>>>>", reservedSeats);

  // CLICK FUNCTIONALITY FOR BOOKING, EDITING AND CANCELING!!!
  const handleClick = (e) => {
    e.preventDefault();
    if (!userId) {
      setLoginSignup(true);
    }

    if (e.target.name === "deleteBtn") {
      console.log("DELETE EVENT HERE");
      const oldAmtOfOpenSeats = booking.openSeats;
      const newAmountOfOpenSeats = oldAmtOfOpenSeats + reservedSeats;
      dispatch(
        deleteMemberBooking({ ...booking, userId, newAmountOfOpenSeats })
      );
     setGuests("")
     setPayment(false)
    } else if (e.target.name === "editBtn") {
      const newReservedSeats = guests;
      const bookingAmtOfGuests = booking.openSeats;
      const differenceInSeats = reservedSeats - newReservedSeats;
      const newAmountOfOpenSeats = bookingAmtOfGuests + differenceInSeats;
      dispatch(
        editMemberBooking({
          ...booking,
          userId,
          newAmountOfOpenSeats,
          newReservedSeats,
        })
      );
    } else if (e.target.name === "bookBtn") {
      if (guests){
        const bookingAmtOfGuests = booking.openSeats;
        const newAmountOfOpenSeats = bookingAmtOfGuests - guests;
        setLoginSignup(false);
        dispatch(
          addMemberBookings({
            ...booking,
            userId,
            newAmountOfOpenSeats,
            guests,
          })
        );
        setPayment(true)
        // navigate("/");
      } else {
        alert("please select number of guests/seats")
      }
    }
  };

  // END BUTTON FUNCTIONALITY //

  const openSeatsArray = [];
  // openSeats
  for (let i = 1; i <= booking?.openSeats; i++) {
    openSeatsArray.push(i);
  }

  const availableSeatsArray = [];
  const availableSeats = reservedSeats + booking?.openSeats;
  // reserved seats
  for (let i = 1; i <= availableSeats; i++) {
    availableSeatsArray.push(i);
  }

  if (isLoading) {
    return <LinearProgress />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="memberBooking-container">
      <div className="memberBooking-allInfo">
        <div className="memberBooking-images-title">
          <ImageList className="memberBooking-images">
            <ImageListItem>
              <img /> A BUNCH OF IMAGES GO HERE!!!
            </ImageListItem>
            <ImageListItem>
              <img /> A BUNCH OF IMAGES GO HERE!!!
            </ImageListItem>
            <ImageListItem>
              <img /> A BUNCH OF IMAGES GO HERE!!!
            </ImageListItem>
            <ImageListItem>
              <img /> A BUNCH OF IMAGES GO HERE!!!
            </ImageListItem>
          </ImageList>
          <div className="memberBooking-title">
            <h1>{booking.title}</h1>
            <p>
              <small>
                Hosted by{" "}
                <Link to={`/chefs`} style={{ color: "red" }}>
                  {booking?.chefBooking?.firstName}{" "}
                </Link>
                in {booking?.city}
              </small>
            </p>
          </div>
        </div>
        <div className="memberBooking-experience">
          <div className="memberBooking-experience-shortDetails">
            <div className="memberBooking-experience-cuisine">
              Cuisine: {booking?.cuisine?.category}
            </div>
            <div className="memberBooking-experience-guests">
              {booking.openSeats === 1
                ? `${booking.openSeats} seat left`
                : `${booking.openSeats} seats left`}
            </div>
            <div className="memberBooking-experience-guests">
              {booking.maxSeats} guests maximum
            </div>
            <div className="memberBooking-experience-time">
              <div className="memberBooking-experience-time-start">
                Start: {booking.startDateTime}
              </div>
              <div className="memberBooking-experience-time-end">
                End: {booking.endDateTime}
              </div>
            </div>
          </div>
          <div className="memberBooking-experience-menu">
            Menu: {booking.menu}
          </div>
        </div>
      </div>
      <Box className="memberBooking-form-container">
        {reservedSeats ? (
          <Box className="memberBooking-form" component="form">
            <div className="reservedSeats">
              {currentMember
                ? `You have reserved ${reservedSeats} ${
                    reservedSeats === 1 ? "seat" : "seats"
                  } for this booking`
                : ""}
            </div>
            <br />
            <Box sx={{ width: "200px" }}>
              <FormControl fullWidth>
                <InputLabel id="guests">Change Seat Amount</InputLabel>
                <Select
                  value={guests}
                  label="guests"
                  onChange={(e) => {
                    console.log(e.target.value), setGuests(e.target.value);
                  }}
                >
                  {availableSeatsArray?.map((guest) => (
                    <MenuItem key={guest} value={guest}>
                      {guest} {guest <= 1 ? "guest" : "guests"}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            ${booking?.suggestedDonation} per person
            <br />
            {/* Total: ${booking?.suggestedDonation * reservedSeats} */}
            <Button variant="contained" onClick={handleClick} name="editBtn">
              {" "}
              Edit Seats{" "}
            </Button>
            <Button variant="contained" onClick={handleClick} name="deleteBtn">
              {" "}
              Cancel Booking{" "}
            </Button>
          </Box>
        ) : (
          <>
            <Box className="memberBooking-form" component="form">
              <FormControl fullWidth>
                <InputLabel id="guests">Guests</InputLabel>
                <Select
                  value={guests}
                  label="guests"
                  onChange={(e) => {
                    console.log(e.target.value), setGuests(e.target.value);
                  }}
                >
                  {openSeatsArray?.map((guest) => (
                    <MenuItem key={guest} value={guest}>
                      {guest} {guest <= 1 ? "guest" : "guests"}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box className="memberBooking-form-donation" fullwidth="true">
                <Box
                  id="outlined-adornment-amount"
                  label="Donation Amount"
                  defaultValue={`${booking?.suggestedDonation}`}
                >
                  {" "}
                  ${booking?.suggestedDonation} per person
                </Box>
              </Box>
              {booking?.openSeats <= 0 ? (
                <Button
                  variant="contained"
                  sx={{
                    "&:hover": {
                      backgroundColor: "#EB5757",
                      color: "whitesmoke",
                    },
                    backgroundColor: "#EB5757",
                    color: "whitesmoke",
                  }}
                >
                  {" "}
                  Sold Out{" "}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleClick}
                  name="bookBtn"
                >
                  Book
                </Button>
              )}
            </Box>
            <Box className="memberBooking-login-signup">
              {loginSignUp ? "PLEASE LOGIN OR SIGNUP TO BOOK EVENT" : null}{" "}
            </Box>
          </>
        )}
        {payment && (
          <Box>
            <Payment reservedSeats={reservedSeats} booking={booking} />
          </Box>
        )}
      </Box>
    </div>
  );
};

export default MemberBooking;
