import React from 'react';
import { slide as Menu } from 'react-burger-menu'

class BurgerSidebar extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <Menu isOpen={true}>
                <a id="from" className="menu-item" href="/">From</a>
                <a id="to" className="menu-item" href="/about">To</a>
                <a id="course" className="menu-item" href="/contact">Course</a>
                <a id="type" className="menu-item" href="">Type</a>
            </Menu>
        )
    }
}

export default BurgerSidebar;