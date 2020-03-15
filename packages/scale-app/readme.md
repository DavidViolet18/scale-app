## ScaleApp
------

## Application

### Création d'une application
```JavaScript
let app = new ScaleApp();
app.start()
```

### Cycle de vie de l'application
```
- Enregistrement des plugins
- Enregistrements des modules
- Démarrage de l'application
    - Exécution des plugins
    - Exécution des modules
    - Exécution des instances de modules
```

## Plugins

### Ajout d'un plugin
```JavaScript
app.use(scaleAppStorePlugin())
app.use([ scaleAppStorePlugin(), ...otherPlugins ])
```

## Modules

### Ajout d'un module
```JavaScript
@Module({
    imports: [],    // liste de modules à importer
    providers: [],  // liste de services à instancier
})
class TestModule {}

app.registerModule(TestModule);
```

## Services

```JavaScript
@Service()
class Logger {}

@Service()
class MyService {
    constructor(
        private readonly logger: Logger
    ){}
}
```

## Mediateur

