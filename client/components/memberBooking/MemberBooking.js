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
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
} from "@mui/material";

import Payment from "../stripePayment/Payment";

//css
import "./memberBooking.css";

const ButtonStyle = {
  "&:hover": {
    backgroundColor: "#EB5757",
    color: "whitesmoke",
  },
  backgroundColor: "#EB5757",
  color: "whitesmoke",
}

const MemberBooking = ({ user }) => {
  const { bookingId } = useParams();
  const { id } = user;
  const userId = id;
  const [guests, setGuests] = useState("");
  const [payment, setPayment] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSingleBookingAsync(bookingId));
    if (id) {
      dispatch(fetchSingleMember(id));
    }
  }, [dispatch, user, id]);

  const { booking, error, isLoading } = useSelector(selectSingleBooking);
  const [loginSignUp, setLoginSignup] = useState(false);
  const { currentMember } = useSelector(selectSingleMember);
  const memberBookings = booking?.memberBooking;
  const memberBooking = memberBookings?.find((member) => member.id == userId);
  const reservedSeats = memberBooking?.users_bookings.reservedSeats;

  const [newBookingState, setNewBookingState] = useState({});

  // CLICK FUNCTIONALITY FOR BOOKING, EDITING AND CANCELING!!!
  const handleClick = (e) => {
    e.preventDefault();
    if (!userId) {
      setLoginSignup(true);
    }

    if (e.target.name === "deleteBtn") {
      const oldAmtOfOpenSeats = booking.openSeats;
      const newAmountOfOpenSeats = oldAmtOfOpenSeats + reservedSeats;
      dispatch(
        deleteMemberBooking({ ...booking, userId, newAmountOfOpenSeats })
      );
      setGuests("");
      setPayment(false);
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
      setNewBookingState({
        ...booking,
        userId,
        newAmountOfOpenSeats,
        guests,
      });
    } else if (e.target.name === "bookBtn") {
      if (guests && !user.id) {
        setLoginSignup(true);
      } else if (guests && user) {
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
        setNewBookingState({
          ...booking,
          userId,
          newAmountOfOpenSeats,
          guests,
        });
        setPayment(true);
      } else {
        alert("please select number of guests/seats");
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
        <div
          className="memberBooking-images-title"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3),rgba(0, 0, 0, 0.3)), url(${booking.imageUrl})`,
            height: "250px",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            borderRadius: "25px",
          }}
        >

          <div className="memberBooking-title">
            <h1
            style={{
              color: '#F2F2F2',
              fontSize: "3rem",
            }} >
              {booking.title}
              </h1>
            <p>
              <small style={{
              color: '#F2F2F2',
              background: 'rgba(27, 32, 44, .8)',
              borderRadius: '25px',
              padding: '5px'
            }}>
                Hosted by{" "}
                <Link to={`/chefs`} style={{textDecoration: "underline", color: "#eb5757" }}>
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
      <Box
        className="memberBooking-form-container"
        sx={{
          backgroundColor: "white",
          maxHeight: "600px"
        }}
      >
        {reservedSeats ? (
          <Box className="memberBooking-form" component="form">
            <div className="reservedSeats">
              {currentMember
                ? `You have reserved ${reservedSeats} ${
                    reservedSeats === 1 ? "seat" : "seats"
                  } for this booking`
                : ""}
            </div>

            <Box sx={{ width: "100%" }}>
              <FormControl fullWidth>
                <InputLabel id="change-seat-amount">Change Seat Amount</InputLabel>
                <Select
                  value={guests}
                  label="change-seat-amount"
                  onChange={(e) => {
                    setGuests(e.target.value);
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

            {/* Total: ${booking?.suggestedDonation * reservedSeats} */}
            <Box style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <Button variant="contained" onClick={handleClick} name="editBtn" sx={ButtonStyle}>
              {" "}
              Edit Seats{" "}
            </Button>
            <Button variant="contained" onClick={handleClick} name="deleteBtn" sx={ButtonStyle}>
              {" "}
              Cancel Booking{" "}
            </Button>
            </Box>
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
                    setGuests(e.target.value);
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
                  sx={ButtonStyle}
                >
                  {" "}
                  Sold Out{" "}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleClick}
                  name="bookBtn"
                  sx={ButtonStyle}
                >
                  Reserve
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
            <Payment
              newBookingState={newBookingState}
              guests={guests}
              booking={booking}
              bookingId={bookingId}
            />
          </Box>
        )}
      </Box>
    </div>
  );
};

export default MemberBooking;
