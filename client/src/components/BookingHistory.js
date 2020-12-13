import React from "react";
import { AuthContext } from "../auth/AuthContext";
import API from "../API/API";
import Button from "react-bootstrap/Button";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import MyCalendar from "./MyCalendar.js";
import moment from "moment";


class BookingHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = { authUser: {}, resHistory: [] };
  }

  componentDidMount() {
    API.isAuthenticated()
      .then((user) => {
        this.setState((state) => ({ authUser: user }));
        API.getBookingHistory(this.state.authUser.userId)
          .then((r) => {
            // console.log(r);
            this.setState({ resHistory: r });
          })
          .catch((errorObj) => {
            
          });
      })
      .catch((err) => {
        this.setState({ authErr: err.errorObj });
      });
  }

  cancelReservation = (id,lectureId) => {
    API.cancelReservation(id, lectureId)
      .then(() => {
        API.getBookingHistory(this.state.authUser.userId)
          .then((r) => {
            this.setState({ resHistory: r });
          })
          .catch((errorObj) => {
            
          });
      })
      .catch((errorObj) => {
      
      });
  };

  cancelReservationConfirm = (id,lectureId) => {
    confirmAlert({
      title: "Warning",
      message: `Do you want to cancel the reservation for this lecture?`,
      buttons: [
        {
          label: "Yes",
          onClick: () => this.cancelReservation(id,lectureId),
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  // createBookingHistory = (r) => {
  //   console.log(r)
  //   return (
  //     <tr>
  //       <td>{r.courseName}</td>
  //       <td>{r.teacherName}</td>
  //       <td>{r.bookDate}</td>
  //       <td>{r.bookingDeadline}</td>
  //       <td>{r.reserved == null ? "No" : "Yes"}</td>
  //       <td>
  //         {r.canceled == null ? (
  //           "No"
  //         ) : (
  //           <div>
  //             <span>You canceled at: </span>
  //             <span className="badge badge-danger">{r.cancelDate}</span>
  //           </div>
  //         )}
  //       </td>
  //       <td>{r.presence == null ? "N/A" : "Yes"}</td>
  //       <td>{r.reserveDate == null ? "N/A" : r.reserveDate}</td>
  //       <td>
  //         {
  //           //
  //           r.canceled === null ? (
  //             <Button
  //               variant="danger"
  //               className="ml-2"
  //               type="button"
  //               onClick={() => this.cancelReservationConfirm(r.bookingId)}
  //             >
  //               Cancel
  //             </Button>
  //           ) : (
  //             ""
  //           )
  //         }
  //       </td>
  //     </tr>
  //   );
  // };
  render() {
    console.log(this.state.resHistory)

  
    var color = ["#b71c1c", "#4A148C", "#1A237E","#01579B", "#004D40", "#33691E", "#F57F17", "#E65100", "#37474F"];
    var courseIds = this.state.resHistory.map((res)=>(res.courseId)); 
    courseIds = [... new Set(courseIds)]
    var courseColors = courseIds.map((id, index)=>({courseId:id, color:color[index] }))
    
    return (
      <AuthContext.Consumer>
        {(context) => (
          <MyCalendar
            reservations={this.state.resHistory.map((res) => ({
              id: res.bookingId,
              title: res.courseName,
              start: moment(res.schedule).toDate(),
              end: moment(res.endTime).toDate(),
              allDay: false,
              color: Object(courseColors.filter((col)=> {return col.courseId == res.courseId})[0])['color']
            }))}
            cancelBooking = {this.cancelReservationConfirm}
            resHistory = {this.state.resHistory}
          />
        )}
      </AuthContext.Consumer>
    );
  }
}

export default BookingHistory;
