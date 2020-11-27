import React from "react";
import { Route } from "react-router-dom";
import { Switch } from "react-router";
import TeacherPage from "./TeacherPage";
import TeacherStatsPage from "./TeacherStatsPage";
import API from '../api/Api';

class TeacherRoute extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = { courses: [], fetchError: false, loading: true }
    }

    componentDidMount() {
        this._isMounted = true;
        API.getCoursesByTeacherId(this.props.user.userId)
            .then((courses) => {
                if (this._isMounted)
                    this.setState({ courses: courses, loading: false });
            })
            .catch((error) => {
                let errormsg = error.source + " : " + error.error;
                this.setState({ fetchError: errormsg, loading: false });
            })


    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return <Switch>
            {!this.state.loading && <>
                <Route
                    path="/teacherPage/main"
                    render={() => {
                        return <TeacherPage user={this.props.user} courses={this.state.courses} fetchError={this.state.fetchError} />;
                    }}
                ></Route>
                <Route
                    path="/teacherPage/stats"
                    render={() => {
                        return <TeacherStatsPage user={this.props.user} courses={this.state.courses} />;
                    }}
                ></Route>
            </>}

        </Switch>
    }
}

export default TeacherRoute;