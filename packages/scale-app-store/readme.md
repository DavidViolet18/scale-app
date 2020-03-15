## ScaleAppStore
------

```JavaScript
app.use(scaleAppStorePlugin());

if(useSpecificStore){
    let specificStore = new Store();
    app.setStore(specificStore);
}

let ToDoActions = {
    add: app.getStore().createStoreAction<string>("todo.add"),
    remove: app.getStore().createStoreAction<string>("todo.remove"),
    check: app.getStore().createStoreAction<{ todo: string, value: boolean }>("todo.check"),
}
app.getStore().addReducers({
    todo: (state: string[] = [], action) => {
        if(app.getStore().isStoreAction(action, ToDoActions.add)){
            return [
                ...state,
                action.payload
            ]
        }
        return state;
    }
})

app.getStore().dispatch(ToDoActions.add("nouvelle tâche"))
console.log(app.getStore().getState().todo)
```