import * as React from "react";
import { Typeahead } from 'react-bootstrap-typeahead';

// sadly the typeahead library in jsx wanted every property to be set
// so its been moved to this sandbox so i don't have to deal with it

const TypeAhead = (props) => {
    return <Typeahead
            allowNew
            placeholder={props.placeholder}
            options={props.options}
            newSelectionPrefix="New item:"
            selected={props.selected}
            onChange={props.onChange}
        />;
};

export default TypeAhead;