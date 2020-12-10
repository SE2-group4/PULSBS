import React from "react";
import { Route } from "react-router-dom";
import { Switch } from "react-router";
import ManagerReportPage from "./ManagerReportPage";
import ManagerStatsPage from "./ManagerStatsPage";


class ManagerRoute extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return <>
            <Switch>
                <Route
                    path="/bookingManagerPage/reportTracing"
                    render={() => {
                        return <ManagerReportPage user={this.props.user} />;
                    }}
                ></Route>
                <Route
                    path="/bookingManagerPage/stats"
                    render={() => {
                        return <ManagerStatsPage user={this.props.user} />;
                    }}
                ></Route>

            </Switch>
        </>;
    }
}

export default ManagerRoute;
