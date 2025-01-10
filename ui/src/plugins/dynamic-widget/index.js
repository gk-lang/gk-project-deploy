import DynamicWidget from "dynamic-widget";
export const setupDynamicWidget = (app) => {
  app.use(DynamicWidget);
  import("dynamic-widget/dist/index.css");
};
