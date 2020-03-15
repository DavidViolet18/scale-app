import { Module } from "@dadoudidou/scale-app";
import { TestModule } from "~Modules/Test/test.module";
import { ReactRouterModule } from "@dadoudidou/scale-app-react-router";

@Module({
    imports: [
        ReactRouterModule,
        TestModule
    ]
})
export class AppModule{}