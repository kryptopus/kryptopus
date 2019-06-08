FROM bitnami/minideb:stretch

RUN apt-get update
RUN apt-get install -y wget
RUN wget https://bitcoincore.org/bin/bitcoin-core-0.17.1/bitcoin-0.17.1-x86_64-linux-gnu.tar.gz
RUN tar -zxf bitcoin-0.17.1-x86_64-linux-gnu.tar.gz

ENTRYPOINT ["/bitcoin-0.17.1/bin/bitcoind", "-prune=550", "-blocksonly", "-rest", "-server"]
CMD ["/bitcoin-0.17.1/bin/bitcoin-cli"]

