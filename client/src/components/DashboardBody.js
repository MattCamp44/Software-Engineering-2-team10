import React from 'react';
import API from '../API/API';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faTrashAlt, faLaptop, faArrowLeft } from '@fortawesome/free-solid-svg-icons'

class DashboardBody extends React.Component {

    constructor(props) {
        super(props);
        this.state = { courses: [], lectures: [], students: [], selectedCourse: null, selectedLecture: null, userId: props.id, nPagesL: 0, currentPageL: 0, showCancelledL: 0 };
    }

    componentDidMount() {
        API.getTeacherCourses()
            .then((data) => {
                this.setState({ courses: data, selectedCourse: null, selectedLecture: null });
            })
            .catch((errorObj) => {
                console.log(errorObj);
            });
    }

    getTeacherCourses = (ev) => {
        API.getTeacherCourses()
            .then((data) => {
                this.setState({ courses: data, selectedCourse: null, selectedLecture: null });
            })
            .catch((errorObj) => {
                console.log(errorObj);
            });
    }

    getCourseLectures = (course) => {
        API.getCourseLectures(course.CourseId)
            .then((data) => {
                data = data.filter(d => d.Canceled === this.state.showCancelledL);
                data.forEach(element => {
                    const diff = new Date(element.Schedule).getTime() - new Date().getTime();
                    element.Cancelable = diff >= 3600000 ? 1 : 0;
                    element.isBookable = diff >= 3600000 / 2 ? 1 : 0;
                });
                this.setState({ lectures: data, selectedCourse: course, selectedLecture: null, nPagesL: Math.ceil(data.length / 10) });
            })
            .catch((errorObj) => {
                console.log(errorObj);
            });
    }

    getLectureStudents = (lecture) => {
        API.getLectureStudents(lecture.LectureId)
            .then((data) => {
                this.setState({ students: data, selectedLecture: lecture });
            })
            .catch((errorObj) => {
                console.log(errorObj);
            });
    }

    deleteLecture = (lecture) => {
        API.cancelLecture(lecture.LectureId)
            .then(() => {
                this.getCourseLectures(this.state.selectedCourse)
            })
            .catch((errorObj) => {
                console.log(errorObj);
            });

    }

    makeLectureOnline = (lecture) => {
        API.makeLectureOnline(lecture.LectureId)
            .then(() => {
                this.getCourseLectures(this.state.selectedCourse)
            })
            .catch((errorObj) => {
                console.log(errorObj);
            });
    }

    setVal = (name, newVal) => {
        console.log(name, newVal);
        this.setState({ [name]: newVal });

        if (name === "showCancelledL")
            this.getCourseLectures(this.state.selectedCourse);
    }


    deleteLectureConfirm = (lecture) => {
        const diff = new Date(lecture.Schedule).getTime() - new Date().getTime();
        if (diff < 3600000) {
            console.log("delete");
            confirmAlert({
                customUI: ({ onClose }) => {
                    return (
                        <div className='custom-ui-danger'>
                            <h1></h1>
                            <p>You cannot delete the selected lecture since it is starting in less than one hour</p>
                            <button onClick={onClose}>Ok</button>
                        </div>
                    );
                }
            });
        } else {
            confirmAlert({
                title: "Warning",
                message: `Are you sure you want to cancel lecture scheduled on ${lecture.Schedule}?`,
                buttons: [
                    {
                        label: 'Yes',
                        onClick: () => this.deleteLecture(lecture)
                    },
                    {
                        label: 'No',
                        onClick: () => { }
                    }
                ]
            })
        }
    }

    makeLectureOnlineConfirm = (lecture) => {
        const diff = new Date(lecture.Schedule).getTime() - new Date().getTime();
        if (diff < 3600000 / 2) {
            console.log("Make online");
            confirmAlert({
                customUI: ({ onClose }) => {
                    return (
                        <div className='custom-ui-danger'>
                            <h1></h1>
                            <p>You cannot make the selected lecture online since it is starting in less than thirty minutes</p>
                            <button onClick={onClose}>Ok</button>
                        </div>
                    );
                }
            });
        } else {
            confirmAlert({
                title: "Warning",
                message: `Are you sure you want to make lecture scheduled on ${lecture.Schedule} online?`,
                buttons: [
                    {
                        label: 'Yes',
                        onClick: () => this.makeLectureOnline(lecture)
                    },
                    {
                        label: 'No',
                        onClick: () => { }
                    }
                ]
            })
        }
    }



    render() {
        return <>
            <h2>Welcome, {this.props.name}</h2>

            <Breadcrumb className="full-width">
                <Breadcrumb.Item onClick={(e) => this.getTeacherCourses(e)}>Courses</Breadcrumb.Item>
                {this.state.selectedCourse != null ?
                    <Breadcrumb.Item onClick={(e) => this.getCourseLectures(this.state.selectedCourse)}>{this.state.selectedCourse.Name}</Breadcrumb.Item> : <></>}
                {this.state.selectedLecture != null ?
                    <Breadcrumb.Item onClick={(e) => this.getLectureStudents(this.state.selectedLecture)}>Lecture of {this.state.selectedLecture.Schedule}</Breadcrumb.Item> : <></>}
            </Breadcrumb>

            {this.state.selectedLecture != null ? <StudentTable students={this.state.students} />
                : this.state.selectedCourse != null ? <LectureTable lectures={this.state.lectures} currentPageL={this.state.currentPageL} nPagesL={this.state.nPagesL} setVal={this.setVal} showCancelledL={this.state.showCancelledL} getLectureStudents={this.getLectureStudents} deleteLectureConfirm={this.deleteLectureConfirm} makeLectureOnlineConfirm={this.makeLectureOnlineConfirm} /> :
                    <CourseTable courses={this.state.courses} getCourseLectures={this.getCourseLectures} />
            }
        </>
    }
}

function CourseTable(props) {
    return <Table striped bordered hover>
        <thead>
            <tr>
                <th className="col-md-1">CourseId</th>
                <th>Name</th>
                <th className="col-md-2"></th>
            </tr>
        </thead>
        <tbody>
            {props.courses.map((e) => <CourseRow key={e.id} course={e} getCourseLectures={props.getCourseLectures} />)}
        </tbody>
    </Table>
}

function CourseRow(props) {
    return <tr>
        <td>{props.course.CourseId}</td>
        <td>{props.course.Name}</td>
        <td className="text-center"><Button variant="primary" onClick={() => props.getCourseLectures(props.course)}>View Lectures <FontAwesomeIcon icon={faArrowRight} /></Button></td>
    </tr>
}

function LectureTable(props) {

    return <>
        <div className="switch-custom align-self-end">
            <Form>
                <Form.Check
                    type="switch"
                    id="custom-switch"
                    label="Show cancelled"
                    checked={props.showCancelledL}
                    onChange={() => props.setVal('showCancelledL', props.showCancelledL === 0 ? 1 : 0)}
                />
            </Form>
        </div>


        <Table striped bordered hover>
            <thead>
                <tr>
                    <th className="col-1">Classroom</th>
                    <th>Schedule</th>
                    <th>Booking deadline</th>
                    <th className="col-1">Bookable</th>
                    <th>Canceled</th>
                    <th className="col-2"></th>
                </tr>
            </thead>
            <tbody>
                {props.lectures.slice(0 + 10 * props.currentPageL, 10 + 10 * props.currentPageL).map((e) => <LectureRow key={e.id} lecture={e} getLectureStudents={props.getLectureStudents} deleteLectureConfirm={props.deleteLectureConfirm} makeLectureOnlineConfirm={props.makeLectureOnlineConfirm} />)}
            </tbody>
        </Table>
        <ButtonGroup className="mb-2 align-self-center">
            <Button onClick={() => props.setVal('currentPageL', props.currentPageL - 1)} disabled={props.currentPageL === 0}><FontAwesomeIcon icon={faArrowLeft} /></Button>
            <Button disabled>{props.currentPageL + 1}</Button>
            <Button onClick={() => props.setVal('currentPageL', props.currentPageL + 1)} disabled={props.currentPageL === props.nPagesL - 1}><FontAwesomeIcon icon={faArrowRight} /></Button>
        </ButtonGroup>
    </>
}

function LectureRow(props) {
    return <tr>
        <td>{props.lecture.ClassNumber}</td>
        <td>{props.lecture.Schedule}</td>
        <td>{props.lecture.BookingDeadline}</td>
        <td className="text-center">{props.lecture.Bookable === 1 ? "Yes" : "No"}</td>
        <td>{props.lecture.Canceled === 0 ? "No" : (<div><span>Canceled at: </span><span className="badge badge-danger">{props.lecture.CancelDate}</span></div>)}</td>
        <td className="text-center">
            <div class="d-inline-flex">
                <DropdownButton title="Actions" id="bg-nested-dropdown" variant="primary" disabled={props.lecture.Canceled === 1}>
                    <Dropdown.Item eventKey="1" onClick={() => props.makeLectureOnlineConfirm(props.lecture)} disabled={props.lecture.isBookable === 0 || props.lecture.Bookable === 0}><FontAwesomeIcon icon={faLaptop} />&nbsp;Turn into distance</Dropdown.Item>
                    <Dropdown.Item eventKey="2" onClick={() => props.deleteLectureConfirm(props.lecture)} disabled={props.lecture.Cancelable === 0}><FontAwesomeIcon icon={faTrashAlt} />&nbsp;&nbsp;Cancel</Dropdown.Item>
                </DropdownButton>
                <Button variant="primary" onClick={() => props.getLectureStudents(props.lecture)}>View Students <FontAwesomeIcon icon={faArrowRight} /></Button>
            </div>
        </td>
    </tr>
}

function StudentTable(props) {
    return <Table striped bordered hover>
        <thead>
            <tr>
                <th>Name</th>
                <th>Booked on</th>
            </tr>
        </thead>
        <tbody>
            {props.students.map((e) => <StudentRow key={e.id} student={e} />)}
        </tbody>
    </Table>
}

function StudentRow(props) {
    return <tr>
        <td>{props.student.Name}</td>
        <td>{props.student.BookDate}</td>
    </tr>
}

export default DashboardBody;