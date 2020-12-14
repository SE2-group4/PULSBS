import React from 'react';
import { slide as Menu } from 'react-burger-menu'
import DayPickerInput from 'react-day-picker/DayPickerInput';
import MultiselectComp from '../components/MultiselectComp';

import { formatDate, parseDate } from 'react-day-picker/moment';

class BurgerSidebar extends React.Component {
    constructor(props) {
        super(props);
        this.handleFromChange = this.handleFromChange.bind(this);
        this.handleToChange = this.handleToChange.bind(this);
        this.state = {
            user: this.props.user,
            typeOptions: [{ name: 'bookings', id: 1 }, { name: 'cancellations', id: 2 }, { name: 'attendance', id: 3 }],
            from: undefined, to: undefined
        }
    }

    handleFromChange(from) {
        // Change the from date and focus the "to" input field
        this.setState({ from });
    }

    handleToChange(to) {
        this.setState({ to }, this.showFromMonth);
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
        const { from, to } = this.state;
        const modifiers = { start: from, end: to };
        if (!this.props.courses)
            return (<></>)
        return (
            <Menu isOpen={true}>
                <a id="from" className="menu-item" >From <div className="InputFromTo">
                    <DayPickerInput
                        value={from}
                        placeholder="From"
                        format="LL"
                        formatDate={formatDate}
                        parseDate={parseDate}
                        dayPickerProps={{
                            selectedDays: [from, { from, to }],
                            disabledDays: { after: to },
                            toMonth: to,
                            modifiers,
                            numberOfMonths: 1,
                            onDayClick: () => this.to.getInput().focus(),
                        }}
                        onDayChange={this.handleFromChange}
                    />{' '}
        To{' '}
                    <span className="InputFromTo-to">
                        <DayPickerInput
                            ref={el => (this.to = el)}
                            value={to}
                            placeholder="To"
                            format="LL"
                            formatDate={formatDate}
                            parseDate={parseDate}
                            dayPickerProps={{
                                selectedDays: [from, { from, to }],
                                disabledDays: { before: from },
                                modifiers,
                                month: from,
                                fromMonth: from,
                                numberOfMonths: 1,
                            }}
                            onDayChange={this.handleToChange}
                        />
                    </span> </div></a>
                <a id="course" className="menu-item" >Courses <MultiselectComp options={this.props.courses} display="description" ></MultiselectComp></a>
                <a id="type" className="menu-item" >Type <MultiselectComp options={this.state.typeOptions} display="name"></MultiselectComp></a>
            </Menu >
        )
    }
}

export default BurgerSidebar;