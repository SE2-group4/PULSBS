import React from 'react';
import { slide as Menu } from 'react-burger-menu'
import DayPickerInput from 'react-day-picker/DayPickerInput';
import MultiselectComp from '../components/MultiselectComp';

class BurgerSidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            typeOptions: [{ name: 'bookings', id: 1 }, { name: 'cancellations', id: 2 }, { name: 'attendance', id: 3 }]
        }
    }

    async componentDidMount() {
        if (!this.props.fetchError)
            try {

            } catch (error) {
                let errormsg = error.source + " : " + error.error;
                this.setState({ fetchError: errormsg, loading: false })
            }
        else
            this.setState({ fetchError: this.props.fetchError, loading: false });
    }




    render() {
        if (!this.props.courses)
            return (<></>)
        return (
            <Menu isOpen={true}>
                <a id="from" className="menu-item" >From <DayPickerInput /></a>
                <a id="to" className="menu-item" >To <DayPickerInput /></a>
                <a id="course" className="menu-item" >Courses <MultiselectComp options={this.props.courses} display="description" ></MultiselectComp></a>
                <a id="type" className="menu-item" >Type <MultiselectComp options={this.state.typeOptions} display="name"></MultiselectComp></a>
            </Menu >
        )
    }
}

export default BurgerSidebar;