import React from 'react';
import { slide as Menu } from 'react-burger-menu'
import DayPickerInput from 'react-day-picker/DayPickerInput';
import MultiselectComp from '../components/MultiselectComp';

class BurgerSidebar extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <Menu isOpen={true}>
                <a id="from" className="menu-item" href="/">From <DayPickerInput /></a>
                <a id="to" className="menu-item" href="/about">To <DayPickerInput /></a>
                <a id="course" className="menu-item" href="/contact">Course <MultiselectComp></MultiselectComp></a>
                <a id="type" className="menu-item" href="">Type <MultiselectComp></MultiselectComp></a>
            </Menu>
        )
    }
}

export default BurgerSidebar;