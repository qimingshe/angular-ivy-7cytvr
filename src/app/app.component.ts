import { Component, VERSION } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  name = 'Angular ' + VERSION.major;
  public connected = false;
  private device: any = null;
  private encoder = new TextEncoder();

  async connect(vendorId: number): Promise<any> {
    if (this.connected) {
      return;
    }
    return navigator['usb']
      .requestDevice({ filters: [{ vendorId: vendorId }] })
      .then(selectedDevice => {
        this.device = selectedDevice;
        console.log(this.device);
        return this.setup();
      })
      .catch(error => {
        console.log(error);
        alert(error);
      });
  }

  async getDevices(): Promise<any> {
    if (this.connected) {
      return;
    }

    console.log(navigator['usb']);
    return navigator['usb']
      .getDevices()
      .then(devices => {
        console.log(devices);
        devices.forEach(device => {
          console.log(
            'Product name: ' +
              device.productName +
              ', serial number ' +
              device.serialNumber
          );
        });
      })
      .catch(error => {
        console.log(error);
        alert(error);
      });
  }

  async printToDevice(text: string[]) {
    this.imprimeLinha('');
    for (let t of text) {
      this.imprimeLinha(t);
    }
  }

  imprimeLinha(text: string) {
    var data = this.encoder.encode(text + '\n');
    this.device
      .transferOut(
        this.device.configuration.interfaces[0].alternates[0].endpoints[1]
          .endpointNumber,
        data
      )
      .catch(error => {
        console.log(error);
      });
  }

  setup() {
    return this.device
      .open()
      .then(() => this.device.selectConfiguration(1))
      .then(() =>
        this.device.claimInterface(
          this.device.configuration.interfaces[0].interfaceNumber
        )
      )
      .then(() => {
        this.connected = true;
      });
  }
}
