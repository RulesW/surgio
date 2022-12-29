import test from 'ava';

import { NodeTypeEnum, PossibleNodeConfigType } from '../../types';
import * as surge from '../surge';

test('getSurgeExtendHeaders', (t) => {
  t.is(
    surge.getSurgeExtendHeaders({
      foo: 'bar',
      'multi words key': 'multi words value',
    }),
    'foo:bar|multi words key:multi words value',
  );
});

test('getSurgeNodes', async (t) => {
  const nodeList: ReadonlyArray<PossibleNodeConfigType> = [
    {
      nodeName: 'Test Node 1',
      type: NodeTypeEnum.Shadowsocks,
      hostname: 'example.com',
      port: '443',
      method: 'chacha20-ietf-poly1305',
      password: 'password',
      obfs: 'tls',
      'obfs-host': 'example.com',
      'udp-relay': true,
    },
    {
      nodeName: 'Test Node 2',
      type: NodeTypeEnum.Shadowsocks,
      hostname: 'example2.com',
      port: '443',
      method: 'chacha20-ietf-poly1305',
      password: 'password',
    },
    {
      enable: false,
      nodeName: 'Test Node 3',
      type: NodeTypeEnum.Shadowsocks,
      hostname: 'example2.com',
      port: '443',
      method: 'chacha20-ietf-poly1305',
      password: 'password',
    },
    {
      nodeName: '测试中文',
      type: NodeTypeEnum.Shadowsocksr,
      hostname: '127.0.0.1',
      port: '1234',
      method: 'aes-128-cfb',
      password: 'aaabbb',
      obfs: 'tls1.2_ticket_auth',
      obfsparam: 'breakwa11.moe',
      protocol: 'auth_aes128_md5',
      protoparam: '',
      binPath: '/usr/local/bin/ssr-local',
      localPort: 61100,
    },
    {
      type: NodeTypeEnum.Vmess,
      alterId: '64',
      hostname: '1.1.1.1',
      method: 'auto',
      network: 'ws',
      nodeName: '测试 3',
      path: '/',
      port: 8080,
      tls: false,
      host: '',
      uuid: '1386f85e-657b-4d6e-9d56-78badb75e1fd',
      binPath: '/usr/local/bin/v2ray',
      localPort: 61101,
    },
    {
      type: NodeTypeEnum.Vmess,
      alterId: '64',
      hostname: '1.1.1.1',
      method: 'auto',
      network: 'ws',
      nodeName: '测试 4',
      path: '/',
      port: 8080,
      tls: true,
      host: '',
      uuid: '1386f85e-657b-4d6e-9d56-78badb75e1fd',
      binPath: '/usr/local/bin/v2ray',
      localPort: 61101,
      surgeConfig: {
        v2ray: 'native',
      },
    },
    {
      type: NodeTypeEnum.Vmess,
      alterId: '64',
      hostname: '1.1.1.1',
      method: 'aes-128-gcm',
      network: 'tcp',
      nodeName: '测试 5',
      path: '/',
      port: 8080,
      tls: false,
      host: '',
      uuid: '1386f85e-657b-4d6e-9d56-78badb75e1fd',
      binPath: '/usr/local/bin/v2ray',
      localPort: 61101,
      surgeConfig: {
        v2ray: 'native',
      },
    },
    {
      nodeName: 'Test Node 4',
      type: NodeTypeEnum.Shadowsocks,
      hostname: 'example.com',
      port: '443',
      method: 'chacha20-ietf-poly1305',
      password: 'password',
      obfs: 'tls',
      'obfs-host': 'example.com',
      'udp-relay': true,
      mptcp: true,
      surgeConfig: {
        shadowsocksFormat: 'ss',
      },
    },
    {
      nodeName: 'Test Node 5',
      type: NodeTypeEnum.Shadowsocks,
      hostname: 'example2.com',
      port: '443',
      method: 'chacha20-ietf-poly1305',
      password: 'password',
      mptcp: false,
      surgeConfig: {
        shadowsocksFormat: 'ss',
      },
    },
    {
      nodeName: 'Test Node 6',
      type: NodeTypeEnum.Shadowsocks,
      hostname: 'example2.com',
      port: '443',
      method: 'chacha20-ietf-poly1305',
      password: 'password',
      surgeConfig: {
        shadowsocksFormat: 'ss',
      },
    },
    {
      nodeName: 'Test Node 7',
      type: NodeTypeEnum.Shadowsocks,
      hostname: 'example2.com',
      port: '443',
      method: 'chacha20-ietf-poly1305',
      password: 'password',
      surgeConfig: {
        shadowsocksFormat: 'ss',
      },
      tfo: true,
      mptcp: true,
    },
    {
      type: NodeTypeEnum.Vmess,
      alterId: '64',
      hostname: '1.1.1.1',
      method: 'auto',
      network: 'ws',
      nodeName: '测试 6',
      path: '/',
      port: 8080,
      tls: true,
      tls13: true,
      skipCertVerify: true,
      host: '',
      uuid: '1386f85e-657b-4d6e-9d56-78badb75e1fd',
      binPath: '/usr/local/bin/v2ray',
      localPort: 61101,
      surgeConfig: {
        v2ray: 'native',
      },
      tfo: true,
      mptcp: true,
    },
    {
      type: NodeTypeEnum.Vmess,
      alterId: '64',
      hostname: '1.1.1.1',
      method: 'auto',
      network: 'ws',
      nodeName: '测试 7',
      path: '/',
      port: 8080,
      tls: true,
      tls13: true,
      skipCertVerify: true,
      host: '',
      uuid: '1386f85e-657b-4d6e-9d56-78badb75e1fd',
      binPath: '/usr/local/bin/v2ray',
      localPort: 61101,
      surgeConfig: {
        v2ray: 'native',
      },
      tfo: true,
      mptcp: true,
      underlyingProxy: 'another-proxy',
    },
  ];
  const txt1 = surge.getSurgeNodes(nodeList).split('\n');
  const txt2 = surge.getSurgeNodes(
    nodeList,
    (nodeConfig) => nodeConfig.nodeName === 'Test Node 1',
  );

  t.is(
    txt1[0],
    'Test Node 1 = custom, example.com, 443, chacha20-ietf-poly1305, password, https://raw.githubusercontent.com/ConnersHua/SSEncrypt/master/SSEncrypt.module, udp-relay=true, obfs=tls, obfs-host=example.com',
  );
  t.is(
    txt1[1],
    'Test Node 2 = custom, example2.com, 443, chacha20-ietf-poly1305, password, https://raw.githubusercontent.com/ConnersHua/SSEncrypt/master/SSEncrypt.module',
  );
  t.is(
    txt1[2],
    '测试中文 = external, exec = "/usr/local/bin/ssr-local", args = "-s", args = "127.0.0.1", args = "-p", args = "1234", args = "-m", args = "aes-128-cfb", args = "-o", args = "tls1.2_ticket_auth", args = "-O", args = "auth_aes128_md5", args = "-k", args = "aaabbb", args = "-l", args = "61100", args = "-b", args = "127.0.0.1", args = "-g", args = "breakwa11.moe", local-port = 61100, addresses = 127.0.0.1',
  );
  t.is(
    txt1[3],
    '测试 3 = external, exec = "/usr/local/bin/v2ray", args = "--config", args = "$HOME/.config/surgio/v2ray_61101_1.1.1.1_8080.json", local-port = 61101, addresses = 1.1.1.1',
  );
  t.is(
    txt1[4],
    '测试 4 = vmess, 1.1.1.1, 8080, username=1386f85e-657b-4d6e-9d56-78badb75e1fd, ws=true, ws-path=/, ws-headers="host:1.1.1.1|user-agent:Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1", tls=true, vmess-aead=false',
  );
  t.is(
    txt1[5],
    '测试 5 = vmess, 1.1.1.1, 8080, username=1386f85e-657b-4d6e-9d56-78badb75e1fd, encrypt-method=aes-128-gcm, vmess-aead=false',
  );
  t.is(
    txt1[6],
    'Test Node 4 = ss, example.com, 443, encrypt-method=chacha20-ietf-poly1305, password=password, udp-relay=true, obfs=tls, obfs-host=example.com, mptcp=true',
  );
  t.is(
    txt1[7],
    'Test Node 5 = ss, example2.com, 443, encrypt-method=chacha20-ietf-poly1305, password=password, mptcp=false',
  );
  t.is(
    txt1[8],
    'Test Node 6 = ss, example2.com, 443, encrypt-method=chacha20-ietf-poly1305, password=password',
  );
  t.is(
    txt1[9],
    'Test Node 7 = ss, example2.com, 443, encrypt-method=chacha20-ietf-poly1305, password=password, tfo=true, mptcp=true',
  );
  t.is(
    txt1[10],
    '测试 6 = vmess, 1.1.1.1, 8080, username=1386f85e-657b-4d6e-9d56-78badb75e1fd, ws=true, ws-path=/, ws-headers="host:1.1.1.1|user-agent:Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1", tls=true, tls13=true, skip-cert-verify=true, tfo=true, mptcp=true, vmess-aead=false',
  );
  t.is(
    txt1[11],
    '测试 7 = vmess, 1.1.1.1, 8080, username=1386f85e-657b-4d6e-9d56-78badb75e1fd, ws=true, ws-path=/, ws-headers="host:1.1.1.1|user-agent:Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1", tls=true, tls13=true, skip-cert-verify=true, tfo=true, mptcp=true, underlying-proxy=another-proxy, vmess-aead=false',
  );

  t.is(
    txt2,
    'Test Node 1 = custom, example.com, 443, chacha20-ietf-poly1305, password, https://raw.githubusercontent.com/ConnersHua/SSEncrypt/master/SSEncrypt.module, udp-relay=true, obfs=tls, obfs-host=example.com',
  );

  t.is(
    surge.getSurgeNodes([
      {
        type: NodeTypeEnum.Trojan,
        nodeName: 'trojan node 1',
        hostname: 'example.com',
        port: 443,
        password: 'password1',
      },
    ]),
    'trojan node 1 = trojan, example.com, 443, password=password1',
  );

  t.is(
    surge.getSurgeNodes([
      {
        type: NodeTypeEnum.Trojan,
        nodeName: 'trojan node 2',
        hostname: 'example.com',
        port: 443,
        password: 'password1',
        sni: 'sni.com',
        tfo: true,
        mptcp: true,
        skipCertVerify: true,
      },
    ]),
    'trojan node 2 = trojan, example.com, 443, password=password1, tfo=true, mptcp=true, sni=sni.com, skip-cert-verify=true',
  );

  t.is(
    surge.getSurgeNodes([
      {
        type: NodeTypeEnum.Trojan,
        nodeName: 'trojan node 1',
        hostname: 'example.com',
        port: 443,
        password: 'password1',
        network: 'ws',
        wsPath: '/ws',
      },
    ]),
    'trojan node 1 = trojan, example.com, 443, password=password1, ws=true, ws-path=/ws',
  );

  t.is(
    surge.getSurgeNodes([
      {
        type: NodeTypeEnum.Trojan,
        nodeName: 'trojan node 1',
        hostname: 'example.com',
        port: 443,
        sni: 'sni.example.com',
        password: 'password1',
        network: 'ws',
        wsPath: '/ws',
        wsHeaders: {
          host: 'ws.example.com',
          'test-key': 'test-value',
        },
      },
    ]),
    'trojan node 1 = trojan, example.com, 443, password=password1, sni=sni.example.com, ws=true, ws-path=/ws, ws-headers="host:ws.example.com|test-key:test-value"',
  );

  t.is(
    surge.getSurgeNodes([
      {
        type: NodeTypeEnum.Socks5,
        nodeName: 'socks5-tls node 1',
        hostname: '1.1.1.1',
        port: 443,
        tls: true,
      },
    ]),
    'socks5-tls node 1 = socks5-tls, 1.1.1.1, 443',
  );

  t.is(
    surge.getSurgeNodes([
      {
        type: NodeTypeEnum.Socks5,
        nodeName: 'socks5-tls node 2',
        hostname: '1.1.1.1',
        port: 443,
        tfo: true,
        tls: true,
      },
    ]),
    'socks5-tls node 2 = socks5-tls, 1.1.1.1, 443, tfo=true',
  );

  t.is(
    surge.getSurgeNodes([
      {
        type: NodeTypeEnum.Socks5,
        nodeName: 'socks5-tls node 3',
        hostname: '1.1.1.1',
        port: 443,
        username: 'auto',
        password: 'auto',
        tls: true,
      },
    ]),
    'socks5-tls node 3 = socks5-tls, 1.1.1.1, 443, username=auto, password=auto',
  );

  t.is(
    surge.getSurgeNodes([
      {
        type: NodeTypeEnum.Socks5,
        nodeName: 'socks5-tls node 4',
        hostname: '1.1.1.1',
        port: 443,
        username: 'auto',
        password: 'auto',
        skipCertVerify: true,
        sni: 'example.com',
        tfo: true,
        tls: true,
      },
    ]),
    'socks5-tls node 4 = socks5-tls, 1.1.1.1, 443, username=auto, password=auto, sni=example.com, tfo=true, skip-cert-verify=true',
  );

  t.is(
    surge.getSurgeNodes([
      {
        type: NodeTypeEnum.Socks5,
        nodeName: 'socks5-tls node 5',
        hostname: '1.1.1.1',
        port: 443,
        username: 'auto',
        password: 'auto',
        skipCertVerify: true,
        sni: 'example.com',
        tfo: true,
        clientCert: 'item',
        tls: true,
      },
    ]),
    'socks5-tls node 5 = socks5-tls, 1.1.1.1, 443, username=auto, password=auto, sni=example.com, tfo=true, skip-cert-verify=true, client-cert=item',
  );

  t.is(
    surge.getSurgeNodes([
      {
        type: NodeTypeEnum.Socks5,
        nodeName: 'socks node 1',
        hostname: '1.1.1.1',
        port: '80',
      },
    ]),
    'socks node 1 = socks5, 1.1.1.1, 80',
  );

  t.is(
    surge.getSurgeNodes([
      {
        type: NodeTypeEnum.Socks5,
        nodeName: 'socks node 2',
        hostname: '1.1.1.1',
        port: '80',
        tfo: true,
      },
    ]),
    'socks node 2 = socks5, 1.1.1.1, 80, tfo=true',
  );

  t.is(
    surge.getSurgeNodes([
      {
        type: NodeTypeEnum.Socks5,
        nodeName: 'socks node 3',
        hostname: '1.1.1.1',
        port: '80',
        username: 'auto',
        password: 'auto',
        tfo: true,
      },
    ]),
    'socks node 3 = socks5, 1.1.1.1, 80, username=auto, password=auto, tfo=true',
  );

  t.is(
    surge.getSurgeNodes([
      {
        type: NodeTypeEnum.Vmess,
        alterId: '64',
        hostname: '1.1.1.1',
        method: 'auto',
        network: 'ws',
        nodeName: '测试 6',
        path: '/',
        port: 8080,
        tls: true,
        tls13: true,
        skipCertVerify: true,
        host: '',
        uuid: '1386f85e-657b-4d6e-9d56-78badb75e1fd',
        binPath: '/usr/local/bin/v2ray',
        localPort: 61101,
        surgeConfig: {
          v2ray: 'native',
        },
        tfo: true,
        mptcp: true,
        testUrl: 'http://www.google.com',
      },
    ]),
    '测试 6 = vmess, 1.1.1.1, 8080, username=1386f85e-657b-4d6e-9d56-78badb75e1fd, ws=true, ws-path=/, ws-headers="host:1.1.1.1|user-agent:Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1", tls=true, tls13=true, skip-cert-verify=true, tfo=true, mptcp=true, test-url=http://www.google.com, vmess-aead=false',
  );

  t.is(
    surge.getSurgeNodes([
      {
        type: NodeTypeEnum.Tuic,
        nodeName: '测试 Tuic',
        hostname: 'example.com',
        port: 443,
        token: 'token',
        serverCertFingerprintSha256: 'sha256',
      },
      {
        type: NodeTypeEnum.Tuic,
        nodeName: '测试 Tuic',
        hostname: 'example.com',
        port: 443,
        token: 'token',
        alpn: ['h3'],
      },
      {
        type: NodeTypeEnum.Tuic,
        nodeName: '测试 Tuic',
        hostname: 'example.com',
        port: 443,
        token: 'token',
        alpn: ['h3'],
        sni: 'sni.example.com',
        skipCertVerify: true,
      },
    ]),
    [
      '测试 Tuic = tuic, example.com, 443, token=token, server-cert-fingerprint-sha256=sha256',
      '测试 Tuic = tuic, example.com, 443, token=token, alpn=h3',
      '测试 Tuic = tuic, example.com, 443, token=token, sni=sni.example.com, skip-cert-verify=true, alpn=h3',
    ].join('\n'),
  );

  t.is(
    surge.getSurgeNodes([
      {
        type: NodeTypeEnum.Snell,
        nodeName: '测试 Snell',
        hostname: 'example.com',
        port: 443,
        psk: 'psk',
        shadowTls: {
          password: 'password',
          sni: 'sni.example.com',
        },
      },
    ]),
    [
      '测试 Snell = snell, example.com, 443, psk=psk, shadow-tls-password=password, shadow-tls-sni=sni.example.com',
    ].join('\n'),
  );

  t.is(
    surge.getSurgeNodes([
      {
        clashConfig: {
          enableWireGuard: true,
        },
        type: NodeTypeEnum.WireGuard,
        nodeName: 'WireGuard',
        hostname: 'wireguard.example.com',
        port: 51820,
        selfIp: '10.0.2.2',
        selfIpV6: 'fd00:114::514', // 可选
        preferIpv6: false, // 可选,仅 Surge 生效
        allowedIps: '0.0.0.0/0', // 可选,仅 Surge 生效
        privateKey: 'sDEZLACT3zgNCS0CyClgcBC2eYROqYrwLT4wdtAJj3s=',
        publicKey: 'fWO8XS9/nwUQcqnkfBpKeqIqbzclQ6EKP20Pgvzwclg=',
        presharedKey: '', // 可选
        dns: ['8.8.8.8', '2606:4700:4700::1001'],
        mtu: 1280, // 可选
        keepalive: 60, // 可选
        udp: true, // 可选,仅 Clash 生效, 默认为 true
      },
    ]),
    ['WireGuard = wireguard, section-name = WireGuard'].join('\n'),
  );

  t.is(
    surge.getSurgeWireGuardNodesConfig([
      {
        type: NodeTypeEnum.WireGuard,
        nodeName: 'WireGuard',
        hostname: 'wireguard.example.com',
        port: 51820,
        selfIp: '10.0.2.2',
        selfIpV6: 'fd00:114::514', // 可选
        preferIpv6: false, // 可选,仅 Surge 生效
        allowedIps: '0.0.0.0/0', // 可选,仅 Surge 生效
        privateKey: 'sDEZLACT3zgNCS0CyClgcBC2eYROqYrwLT4wdtAJj3s=',
        publicKey: 'fWO8XS9/nwUQcqnkfBpKeqIqbzclQ6EKP20Pgvzwclg=',
        presharedKey: 'fWO8XS9/nwUQcqnkfBpKeqIqbzclQ6EKP20Pgvzwclg=', // 可选
        dns: ['8.8.8.8', '2606:4700:4700::1001'],
        mtu: 1280, // 可选
        keepalive: 60, // 可选
        udp: true, // 可选,仅 Clash 生效, 默认为 true
      },
    ]),
    [
      '[WireGuard WireGuard]',
      'dns-server=8.8.8.8, 2606:4700:4700::1001',
      'private-key=sDEZLACT3zgNCS0CyClgcBC2eYROqYrwLT4wdtAJj3s=',
      'self-ip=10.0.2.2',
      'self-ip-v6=fd00:114::514',
      'mtu=1280',
      'prefer-ipv6=false',
      `peer = (${[
        'public-key=fWO8XS9/nwUQcqnkfBpKeqIqbzclQ6EKP20Pgvzwclg=',
        'allowed-ips=0.0.0.0/0',
        'keepalive=60',
        'preshared-key=fWO8XS9/nwUQcqnkfBpKeqIqbzclQ6EKP20Pgvzwclg=',
        'endpoint=wireguard.example.com:51820',
      ].join(', ')})`,
    ].join('\n') + '\n',
  );

  t.is(
    surge.getSurgeWireGuardNodesConfig([
      {
        type: NodeTypeEnum.WireGuard,
        nodeName: 'WireGuard',
        hostname: 'wireguard.example.com',
        port: 51820,
        selfIp: '10.0.2.2',
        privateKey: 'sDEZLACT3zgNCS0CyClgcBC2eYROqYrwLT4wdtAJj3s=',
        publicKey: 'fWO8XS9/nwUQcqnkfBpKeqIqbzclQ6EKP20Pgvzwclg=',
        dns: ['8.8.8.8', '2606:4700:4700::1001'],
      },
    ]),
    [
      '[WireGuard] WireGuard',
      'dns-server=8.8.8.8, 2606:4700:4700::1001',
      'private-key=sDEZLACT3zgNCS0CyClgcBC2eYROqYrwLT4wdtAJj3s=',
      'self-ip=10.0.2.2',
      `peer = (${[
        'public-key=fWO8XS9/nwUQcqnkfBpKeqIqbzclQ6EKP20Pgvzwclg=',
        'endpoint=wireguard.example.com:51820',
      ].join(', ')})`,
    ].join('\n') + '\n',
  );
});
