import { Component } from "react";
import { PiArmchairFill, PiArmchair } from "react-icons/pi";
import { ThreeDots } from "react-loader-spinner";

import {
  typesOfSeats,
  seatQuantity,
  apiStatusConstants,
} from "../../constantData";

import Seat from "../Seat";

import "./index.css";

class BookMySeat extends Component {
  state = {
    seatQty: seatQuantity[0].value,
    seatType: typesOfSeats[0].value,
    tempQty: 0,
    seatData: [],
    apiStatus: apiStatusConstants.initial,
  };

  componentDidMount() {
    this.getSeatsData();
  }

  //Fetch data from API
  getSeatsData = async () => {
    this.setState({ apiStatus: apiStatusConstants.inProgress });
    const api = "http://localhost:3004/seats/";
    const response = await fetch(api);
    if (response.ok) {
      const data = await response.json();
      const updatedData = data.map((seat) => ({
        seatId: seat.seat_id,
        seatNumber: seat.seat_number,
        seatType: seat.seat_type,
        seatRow: seat.seat_row,
        status: seat.status,
        selected: false,
      }));
      this.setState({
        seatData: updatedData,
        apiStatus: apiStatusConstants.success,
      });
    } else {
      this.setState({ apiStatus: apiStatusConstants.failure });
    }
  };

  bookSeat = async () => {
    const { seatType, seatData } = this.state;
    if (seatType === "None") {
      alert("Select seat type");
      return;
    }
    const selectedSeats = [];
    seatData.forEach((eachSeat) => {
      if (eachSeat.selected) {
        selectedSeats.push(eachSeat.seatId);
      }
    });
    if (selectedSeats.length === 0) {
      alert("Please select a seat");
      return;
    }
    const seats = {
      selectedSeats,
    };
    const api = "http://localhost:3004/bookseat/";
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(seats),
    };
    const response = await fetch(api, options);
    const data = await response.json();
    if (response.ok) {
      alert("Ticket booked successfully");
      this.getSeatsData();
    }
    console.log(data);
  };

  updateSelected = (id) => {
    const { seatData, seatType } = this.state;
    const updatedSeatData = seatData.map((eachSeat) => {
      if (eachSeat.seatId === id) {
        if (eachSeat.seatType.toUpperCase() === seatType) {
          if (eachSeat.selected) {
            this.setState((prevState) => ({
              tempQty: parseInt(prevState.tempQty) + 1,
            }));
          } else {
            this.setState((prevState) => ({
              tempQty: parseInt(prevState.tempQty) - 1,
            }));
          }
          return { ...eachSeat, selected: !eachSeat.selected };
        } else {
          alert("Select relevant seat type");
        }
      }
      return eachSeat;
    });
    this.setState({ seatData: updatedSeatData });
  };

  renderSeat = (eachSeat) => {
    const { seatQty, tempQty } = this.state;
    return (
      <Seat
        key={eachSeat.seatId}
        seatDetails={eachSeat}
        updateSelected={this.updateSelected}
        tempQty={tempQty}
        seatQty={seatQty}
      />
    );
  };

  removeAllSelectedSeat = () => {
    const { seatData } = this.state;
    const updatedData = seatData.map((eachSeat) => ({
      ...eachSeat,
      selected: false,
    }));
    this.setState({ seatData: updatedData });
  };

  onChangeSeatType = (e) => {
    this.removeAllSelectedSeat();
    this.setState({ seatType: e.target.value });
  };

  onChangeSeatQty = (e) => {
    this.removeAllSelectedSeat();
    this.setState({ seatQty: e.target.value, tempQty: e.target.value });
  };

  renderSelectDropDown = (items, defaultItem, onChangeFunction) => {
    return (
      <select value={defaultItem} onChange={onChangeFunction}>
        {items.map((eachItem) => (
          <option value={eachItem.value}>{eachItem.displayText}</option>
        ))}
      </select>
    );
  };

  onRetry = () => {
    this.getSeatsData();
  };

  renderSuccessView = () => {
    let chrCode = 65;
    const { seatData, seatType, seatQty } = this.state;
    const premiumSeats = seatData.filter(
      (eachSeat) => eachSeat.seatType === "Premium"
    );
    const standardSeats = seatData.filter(
      (eachSeat) => eachSeat.seatType === "Standard"
    );
    return (
      <div className="booking-container">
        <div className="seats-container">
          <div>
            {this.renderSelectDropDown(
              typesOfSeats,
              seatType,
              this.onChangeSeatType
            )}
            {this.renderSelectDropDown(
              seatQuantity,
              seatQty,
              this.onChangeSeatQty
            )}
          </div>
          <p className="seat-type">Premium seats</p>
          <hr className="separator" />
          <ul>
            {premiumSeats.map((eachSeat) => {
              if (eachSeat.seatNumber.slice(1) === "1") {
                return (
                  <>
                    <hr />
                    <h1 className="row-name">
                      {String.fromCharCode(chrCode++)}
                    </h1>
                    <div className="gap-premium"></div>
                    {this.renderSeat(eachSeat)}
                  </>
                );
              } else if (eachSeat.seatId % 2 === 0) {
                return (
                  <>
                    {this.renderSeat(eachSeat)}
                    <div className="gap-premium"></div>
                  </>
                );
              }
              return this.renderSeat(eachSeat);
            })}
          </ul>
          <p className="seat-type">Standard seats</p>
          <hr className="separator" />
          <ul>
            {standardSeats.map((eachSeat) => {
              if (eachSeat.seatNumber.slice(1) === "1") {
                return (
                  <>
                    <hr />
                    <h1 className="row-name">
                      {String.fromCharCode(chrCode++)}
                    </h1>
                    <div className="gap-standard"></div>
                    {this.renderSeat(eachSeat)}
                  </>
                );
              } else if (eachSeat.seatId % 5 === 0) {
                return (
                  <>
                    {this.renderSeat(eachSeat)}
                    <div className="gap-standard"></div>
                  </>
                );
              }
              return this.renderSeat(eachSeat);
            })}
          </ul>
        </div>
        <div className="seat-layout-detail">
          <h1>Key to seat layout:</h1>
          <p className="seat-info">
            <PiArmchair style={{ marginRight: 10 }} size={22} color="gray" />{" "}
            Available
          </p>
          <p className="seat-info">
            <PiArmchairFill
              style={{ marginRight: 10 }}
              color="grey"
              size={22}
            />{" "}
            Unavailable
          </p>
          <p className="seat-info">
            <PiArmchairFill
              className="seat-selected"
              style={{ marginRight: 10 }}
              size={22}
            />{" "}
            Your Selection
          </p>
          <div>
            <button type="button" onClick={this.bookSeat}>
              Proceed
            </button>
          </div>
        </div>
      </div>
    );
  };

  renderFailureView = () => {
    return (
      <div className="failure-container">
        <h1>Failed to fetch seats data</h1>
        <button type="button" onClick={this.onRetry}>
          Retry
        </button>
      </div>
    );
  };

  renderLoadingView = () => {
    return (
      <div className="loading-container">
        <ThreeDots
          height="50"
          width="50"
          radius="8"
          color="#f84464"
          ariaLabel="three-dots-loading"
          visible={true}
        />
      </div>
    );
  };

  renderApiStatus = () => {
    const { apiStatus } = this.state;

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView();
      case apiStatusConstants.failure:
        return this.renderFailureView();
      case apiStatusConstants.inProgress:
        return this.renderLoadingView();
      default:
        return null;
    }
  };

  render() {
    return (
      <div className="app">
        <h1 className="heading">Book My Seat</h1>
        {this.renderApiStatus()}
      </div>
    );
  }
}

export default BookMySeat;
