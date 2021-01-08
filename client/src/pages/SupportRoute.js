import React from "react";
import { Route } from "react-router-dom";
import { Switch } from "react-router";
import SupportUpdatePage from "./SupportUpdatePage";
import SupportSchedulePage from "./SupportSchedulePage";
import SupportPage from "./SupportPage";


class SupportRoute extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return <>
            <Switch>
                <Route
                    path="/supportPage/setup"
                    render={() => {
                        return <SupportPage user={this.props.user} />;
                    }}
                ></Route>
                <Route
                    path="/supportPage/update"
                    render={() => {
                        return <SupportUpdatePage user={this.props.user} />;
                    }}
                ></Route>
                <Route
                    path="/supportPage/schedules"
                    render={() => {
                        return <SupportSchedulePage user={this.props.user} />;
                    }}
                ></Route>

            </Switch>
        </>;
    }
}

export default SupportRoute;
