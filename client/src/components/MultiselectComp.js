import React from 'react';
import { Multiselect } from 'multiselect-react-dropdown';

class MultiselectComp extends React.Component {
    constructor(props) {
        super(props);
        this.onSelect = this.onSelect.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.state = {
            //selectedValues: []
        };
    }

    render() {
        return (
            <Multiselect
                options={this.props.options} // Options to display in the dropdown
                selectedValues={this.props.selectedValues} // Preselected value to persist in dropdown
                onSelect={this.onSelect} // Function will trigger on select event
                onRemove={this.onRemove} // Function will trigger on remove event
                displayValue={this.props.display} // Property name to display in the dropdown options
            />
        )
    }

    onSelect(selectedList, selectedItem) {
        this.props.handle(selectedList)
    }

    onRemove(selectedList, removedItem) {
        this.props.handle(selectedList)
    }
}

export default MultiselectComp;