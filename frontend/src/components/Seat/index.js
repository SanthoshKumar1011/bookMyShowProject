import { PiArmchairFill, PiArmchair } from "react-icons/pi";

import "./index.css";

const Seat = (props) => {
  const { seatDetails, updateSelected, seatQty, tempQty } = props;
  const { seatId, status, selected } = seatDetails;
  const seatClass = status === "Available" ? "seat" : "seat-booked";
  const selectedSeat = selected ? "seat-selected" : "";
  const CurrentChair = selected ? PiArmchairFill : PiArmchair;

  const selectSeat = () => {
    if (tempQty > 0 || selected) {
      updateSelected(seatId);
    }
    if (seatQty === 0) {
      alert("Select seat quantity");
      return;
    }
  };
  return (
    <li>
      {status === "Available" ? (
        <CurrentChair
          className={`${seatClass} ${selectedSeat}`}
          size={22}
          onClick={selectSeat}
        />
      ) : (
        <PiArmchairFill color="grey" size={22} />
      )}
    </li>
  );
};

export default Seat;
