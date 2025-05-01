const fnv1a32 = (str: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  let hash = 0x811c9dc5; // FNV offset basis

  for (let i = 0, len = data.length; i < len; i++) {
    hash ^= data[i];
    // FNV prime = 16777619
    hash = (hash >>> 0) * 0x01000193 >>> 0;
  }
  return (hash >>> 0).toString(16);
}

export class SCPIDevice {
  usb: USBDevice;
  endpointNumber: number | null = null;
  constructor(usb: USBDevice) {
    this.usb = usb;
  }

  sendSCPICommand = async (cmd: string): Promise<void> => {
    if (!this.usb || this.endpointNumber === null) {
      throw new Error("endpointNumber has not been set. Please call `setup` function at first.")
    }
    const data = new TextEncoder().encode(cmd + '\n');
    try {
      await this.usb.transferOut(this.endpointNumber, data);
      console.log(`Sent: ${cmd}`);
    } catch (err) {
      console.error('transferOut error:', err);
    }
  }

  setup = async () => {
    await this.usb.open();
    if (!this.usb.configuration) {
      await this.usb.selectConfiguration(1);
    }
    // OUT エンドポイントを自動検出
    const cfg = this.usb.configuration;
    if (!cfg) return;
    for (const iface of cfg.interfaces) for (const alt of iface.alternates) {
      const outEp = alt.endpoints.find(e => e.direction === 'out');
      if (!outEp) continue;
      await this.usb.claimInterface(iface.interfaceNumber);
      if (alt.alternateSetting !== 0) {
        await this.usb.selectAlternateInterface(iface.interfaceNumber, alt.alternateSetting);
      }
      this.endpointNumber = outEp.endpointNumber;
      return;
    }
    throw new Error("Endpoint couldn't be detected");
  }

  get id() {
    return fnv1a32(`${fnv1a32(this.usb.productId.toString())},${fnv1a32(this.usb.vendorId.toString())}`);
  }
}

export const isSameScpiDevice = (a: SCPIDevice, b: SCPIDevice) => a.id === b.id;

export const connectToDevice = async (): Promise<SCPIDevice | null> => {
  try {
    const usb = await navigator.usb.requestDevice({ filters: [] });
    const scpi = new SCPIDevice(usb);
    await scpi.setup();
    return scpi;
  } catch (err) {
    console.error(err);
  }
  return null;
}