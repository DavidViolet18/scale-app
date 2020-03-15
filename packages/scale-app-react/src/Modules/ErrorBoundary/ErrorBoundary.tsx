import React, { ErrorInfo } from "react";
import { ScaleApp } from "@dadoudidou/scale-app";

export class ViewError extends Error {
    message: string
    stack?: string
    componentStack?: string
    constructor(message: string, stack?: string, componentStack?: string) {
        super(message);
        this.stack = stack;
        this.componentStack = componentStack;
    }
}

type ErrorBoundaryProps = {
    application: ScaleApp
}
type ErrorBoundaryState = {
    error?: ViewError
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props) {
        super(props);
        this.state = {  };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        let _err = new ViewError(error.message, error.stack, errorInfo.componentStack);
        this.props.application.mediator.publish("viewError", _err);
        this.props.application.mediator.publish(this.props.application.events.error, _err);
        this.setState({
            error: _err,
        });
    }

    render() {
        let Comp = this.props.application.getReactErrorBoundary();
        if (this.state.error) {
            if(Comp){
                return (<Comp error={this.state.error} />)
            }
            return (
                <div>
                    <h2>Une erreur s'est produite.</h2>
                    <details style={{ whiteSpace: 'pre-wrap' }}>
                        {this.state.error && this.state.error.message}
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}
