import {static as static_} from "express";
import {INestApplication, NestModule} from "@nestjs/common";
import {NestFactory} from "@nestjs/core";
import * as bodyParser from "body-parser";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {join} from "path";
import {Config} from "@config";

const SetupSwagger = async (app: INestApplication): Promise<void> => {
  const swaggerConfig = new DocumentBuilder()
    .setTitle("ABI TEST")
    .setDescription("ABI documentação")
    .setVersion("1.0.0")
    .addBearerAuth({type: "http", scheme: "bearer"})
    .build();
  const documentSwagger = SwaggerModule.createDocument(app, swaggerConfig);
  return SwaggerModule.setup("swagger", app, documentSwagger);
};

const Nest = async (app: NestModule): Promise<void> => {
  const application = await NestFactory.create(app, {cors: true});
  application.enableCors();
  application.use(static_(join(__dirname, "..", "public")));
  application.use(bodyParser.json({limit: "20mb"}));
  application.use(bodyParser.urlencoded({limit: "20mb", extended: true}));

  if (Config.NODE_ENV === "DEV") SetupSwagger(application);

  application.listen(Config.PORT, async () => {
    console.log(
      "💣 Application is running in url: ",
      await application.getUrl(),
    );
  });
};

export {Nest};
