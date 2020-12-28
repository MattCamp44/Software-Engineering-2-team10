import React from "react";
import API from "../API/API";
import { Col, Form, Row } from "react-bootstrap";
import { confirmAlert } from "react-confirm-alert"; // Import
import Table from "react-bootstrap/Table";

class OfficerLectureManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedYear: "1",
      selectedSem: "1",
      buttonState: "D",
      lectures: [],
    };
  }

  componentDidMount() {
    API.getOfficerLectures(this.state.selectedYear, this.state.selectedSem)
      .then((lects) => {
        this.setState({
          lectures: lects,
          buttonState: lects[0].Bookable == 1 ? "D" : "B",
        });
      })
      .catch();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.selectedYear !== this.state.selectedYear ||
      prevState.selectedSem !== this.state.selectedSem
    ) {
      API.getOfficerLectures(this.state.selectedYear, this.state.selectedSem)
        .then((lects) => {
          this.setState({
            lectures: lects,
            buttonState:
              lects.length != 0 && lects[0].Bookable == 1 ? "D" : "B",
          });
        })
        .catch();
    }
  }

  onVarChange = (ev, varName) => {
    let value = ev.target.value;
    this.setState({ [varName]: value });

    // API.getOfficerLectures();
  };

  changeLectures = (type, year, sem) => {
    this.setState({ buttonState: type });
    API.changeLectureState(type, year, sem)
      .then(() => {
        API.getOfficerLectures(this.state.selectedYear, this.state.selectedSem)
          .then((lects) => {
            this.setState({
              lectures: lects,
              buttonState:
                lects.length != 0 && lects[0].Bookable == 1 ? "D" : "B",
            });
          })
          .catch();
      })
      .catch((errorObj) => {});
  };

  changeStatusConfirm = (type, year, sem) => {
    confirmAlert({
      title: "Warning",
      message:
        type === "D"
          ? `Do you want to make Year ${year} Semester ${sem} lectures distance lectures?`
          : `Do you want to make Year ${year} Semester ${sem} lectures presence lectures?`,
      buttons: [
        {
          label: "Yes",
          onClick: () =>
            this.changeLectures(type === "B" ? "D" : "B", year, sem),
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  onClickHandler = (ev) => {
    this.changeStatusConfirm(
      ev.target.name,
      this.state.selectedYear,
      this.state.selectedSem
    );
  };
  createLectureRows = (r) => {
    // console.log(r);
    return (
      <tr>
        <td>{r.CourseName}</td>
        <td>{r.Day}</td>
        <td>{r.Time}</td>
        <td>{r.Bookable == 1 ? "Presence" : "Distance"}</td>
      </tr>
    );
  };

  render() {
    return (
      <>
        <div className="container col-md-12">
          <div
            className="jumbotron p-4 p-md-2 text-white rounded"
            style={{ backgroundColor: "rgb(182, 93, 16)", opacity: "60%" }}
          >
            <div className="col-md-6 px-0">
              <h4 className="display-4 font-italic">
                <h5>Welcome, {this.props.name}</h5>
              </h4>
              <p className="lead my-3 font-weight-bold">
                To change lecture bookable state, use the form below:
              </p>
            </div>
          </div>
          <Form>
            <div class="card">
              <div class="card-header">Select lectures</div>
              <div class="card-body">
                <Row>
                  <Col className="col-md-2">
                    <label>Year:</label>
                    <select
                      className="custom-select custom-select-lg mb-3"
                      onChange={(x) => this.onVarChange(x, "selectedYear")}
                    >
                      <option value="1" selected>
                        1
                      </option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </Col>
                  <Col className="col-md-2">
                    <label>Semester:</label>
                    <select
                      className="custom-select custom-select-lg mb-3"
                      onChange={(x) => this.onVarChange(x, "selectedSem")}
                    >
                      <option value="1" selected>
                        1
                      </option>
                      <option value="2">2</option>
                    </select>
                  </Col>
                </Row>

                <Row>
                  <Col className="col-md-2"></Col>
                  <Col className="col-md-2">
                    {this.state.lectures.length != 0 &&
                    this.state.buttonState === "B" ? (
                      <button
                        name="B"
                        type="button"
                        class="btn btn-success btn-block"
                        onClick={(ev) => this.onClickHandler(ev)}
                      >
                        Make Presence
                      </button>
                    ) : this.state.lectures.length != 0 ? (
                      <button
                        name="D"
                        type="button"
                        class="btn btn-warning btn-block"
                        onClick={(ev) => this.onClickHandler(ev)}
                      >
                        Make Distance
                      </button>
                    ) : null}
                  </Col>
                </Row>
                <br />
                <Row>
                  <Table striped bordered hover variant="white">
                    <thead>
                      <tr style={{ color:'white',backgroundColor: "#d5a27e" }}>
                        <th>Course Name</th>
                        <th>Scheduled Day</th>
                        <th>Scheduled Time</th>
                        <th>Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.lectures.length>0 ? this.state.lectures.map(this.createLectureRows): <td colSpan="6" style={{textAlign: "center"}}>No lectures available in the selected period.</td>}
                    </tbody>
                  </Table>
                </Row>
              </div>
            </div>
          </Form>
        </div>
      </>
    );
  }
}

export default OfficerLectureManagement;
