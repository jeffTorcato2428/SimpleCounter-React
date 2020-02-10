import React from 'react'
import Overlay from '../../UI/Overlay/Overlay'
import Spinner from '../../UI/Spinner/Spinner'

const ErrorOverlay = (props) => {

    return (
        <Overlay>
            <Spinner/>
        </Overlay>
    )
}

export default ErrorOverlay