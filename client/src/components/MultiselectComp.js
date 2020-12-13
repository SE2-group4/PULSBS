import React from 'react';
import { Multiselect } from 'multiselect-react-dropdown';

class MultiselectComp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: this.props.options,
            selectedValues: null
        };
    }

    render() {
        return (
            <Multiselect
                options={this.state.options} // Options to display in the dropdown
                selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                onSelect={this.onSelect} // Function will trigger on select event
                onRemove={this.onRemove} // Function will trigger on remove event
                displayValue="name" // Property name to display in the dropdown options
            />
        )
    }

    onSelect(selectedList, selectedItem) {

    }

    onRemove(selectedList, removedItem) {

    }
}

export default MultiselectComp;