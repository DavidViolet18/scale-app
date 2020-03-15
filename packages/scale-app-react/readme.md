## ScaleAppReact
------

```JavaScript
app.use(scaleAppReactPlugin({ domElement: document.getElementById("app") }));

app.setReactErrorBoundary(({ error }) => <div>Une erreur est survenue</div>);
let _errorComponent = app.getReactErrorBoundary();

app.setReactSuspense(() => <div>Chargement...</div>)
let _suspenseComponent = app.getReactSuspense();

@Module({
    bootstrapElement: (props) => {
        console.log(props.application);
        return (<div>{props.children}</div>)
    },
    bootstrapElementOrdering: 0
})
class ModuleApp {}

app.register(ModuleApp);

```