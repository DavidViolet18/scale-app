import React, { ErrorInfo } from "react";
import { Application } from "../../Core/Application";
import { RMError } from "../../Core/ReactModError";
import { RMModule } from "../../Core/Module";

export class RMViewError extends RMError {
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
    application: Application
}
type ErrorBoundaryState = {
    error?: RMViewError
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props) {
        super(props);
        this.state = {  };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        let _err = new RMViewError(error.message, error.stack, errorInfo.componentStack);
        this.props.application.events.trigger("viewError")(_err);
        this.props.application.events.trigger("error")(_err);
        this.setState({
            error: _err,
        });
    }

    render() {
        let Comp = this.props.application.getErrorBoundary();
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
