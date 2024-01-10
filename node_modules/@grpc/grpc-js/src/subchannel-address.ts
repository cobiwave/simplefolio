/*
 * Copyright 2021 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { isIP } from 'net';

export interface TcpSubchannelAddress {
  port: number;
  host: string;
}

export interface IpcSubchannelAddress {
  path: string;
}
/**
 * This represents a single backend address to connect to. This interface is a
 * subset of net.SocketConnectOpts, i.e. the options described at
 * https://nodejs.org/api/net.html#net_socket_connect_options_connectlistener.
 * Those are in turn a subset of the options that can be passed to http2.connect.
 */

export type SubchannelAddress = TcpSubchannelAddress | IpcSubchannelAddress;

export function isTcpSubchannelAddress(
  address: SubchannelAddress
): address is TcpSubchannelAddress {
  return 'port' in address;
}

export function subchannelAddressEqual(
  address1?: SubchannelAddress,
  address2?: SubchannelAddress
): boolean {
  if (!address1 && !address2) {
    return true;
  }
  if (!address1 || !address2) {
    return false;
  }
  if (isTcpSubchannelAddress(address1)) {
    return (
      isTcpSubchannelAddress(address2) &&
      address1.host === address2.host &&
      address1.port === address2.port
    );
  } else {
    return !isTcpSubchannelAddress(address2) && address1.path === address2.path;
  }
}

export function subchannelAddressToString(address: SubchannelAddress): string {
  if (isTcpSubchannelAddress(address)) {
    return address.host + ':' + address.port;
  } else {
    return address.path;
  }
}

const DEFAULT_PORT = 443;

export function stringToSubchannelAddress(
  addressString: string,
  port?: number
): SubchannelAddress {
  if (isIP(addressString)) {
    return {
      host: addressString,
      port: port ?? DEFAULT_PORT,
    };
  } else {
    return {
      path: addressString,
    };
  }
}
