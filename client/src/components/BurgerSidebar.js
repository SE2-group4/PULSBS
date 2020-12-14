import React from 'react';
import { slide as Menu } from 'react-burger-menu'
import DayPickerInput from 'react-day-picker/DayPickerInput';
import MultiselectComp from '../components/MultiselectComp';

class BurgerSidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: props.user, courses: props.courses,
            typeOptions: [{ name: 'bookings', id: 1 }, { name: 'cancellations', id: 2 }, { name: 'attendance', id: 3 }],
            courseNames: []
        }
    }

    async componentDidMount() {
        if (!this.props.fetchError)
            try {
                let cMap = new Map();
                this.state.courses.forEach(function (item) {
                    cMap.set(item.description, item.courseId);
                });
                this.setState({ courseNames: cMap })
            } catch (error) {
                let errormsg = error.source + " : " + error.error;
                this.setState({ fetchError: errormsg, loading: false })
            }
        else
            this.setState({ fetchError: this.props.fetchError, loading: false });
    }




    render() {
        return (
            <Menu isOpen={true}>
                <a id="from" className="menu-item" >From <DayPickerInput /></a>
                <a id="to" className="menu-item" >To <DayPickerInput /></a>
                <a id="course" className="menu-item" >Courses <MultiselectComp options={this.state.courses} display="description" ></MultiselectComp></a>
                <a id="type" className="menu-item" >Type <MultiselectComp options={this.state.typeOptions} display="name"></MultiselectComp></a>
            </Menu >
        )
    }
}

export default BurgerSidebar;