import React from "react";
import { Route } from "react-router-dom";
import { Switch } from "react-router";
import SupportUpdatePage from "./SupportUpdatePage";
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

            </Switch>
        </>;
    }
}

export default SupportRoute;
