import "notyf/notyf.min.css";
import { Notyf, NotyfNotification } from "notyf";

export default class Toast {
  private static notyf = new Notyf({
    duration: 999999,
    position: { x: "right", y: "bottom" },
    dismissible: true,
    ripple: true,
  });

  public static get(): Notyf {
    return this.notyf;
  }

  public static setDuration(duration: number) {
    this.notyf.options.duration = duration;
  }

  public static success(message: string) {
    return this.notyf.success(message);
  }

  public static error(message: string) {
    return this.notyf.error(message);
  }

  public static info(message: string) {
    return this.notyf.open({
      type: "info",
      message: message,
    });
  }

  public static dismiss(toast: NotyfNotification) {
    this.notyf.dismiss(toast);
  }
}