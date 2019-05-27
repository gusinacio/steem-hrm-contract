const dsteem = require('dsteem');
const interpreter = require('./steem_interpreter.js');

const account = 'gustavoinacio';
let opts = {};

opts.addressPrefix = 'STM';
opts.chainId =
    '0000000000000000000000000000000000000000000000000000000000000000';

const client = new dsteem.Client('https://api.steemit.com');

let stream;

async function main() {
    console.log("Starting listening to blocks");
    stream = client.blockchain.getBlockStream();
    stream.on('data', function(block) {
            var i;
            for (i = 0; i < block.transactions.length; i++) {
              var transaction = block.transactions[i];
              if(transaction.operations[0][0] == "custom_json"){
                var custom_json = transaction.operations[0][1];
                if(custom_json.id == "institutionList") {
                  interpreter.onInstitutionListCmdReceive(
                                  custom_json.required_posting_auths[0], JSON.parse(custom_json.json),
                                  transaction.block_num, transaction.transaction_id);
                } else if(custom_json.id == "vacancy") {
                  interpreter.onVacancyCmdReceive(custom_json.required_posting_auths[0],
                                  JSON.parse(custom_json.json), transaction.block_num,
                                  transaction.transaction_id,
                                  block.timestamp);
                }
              } else if(transaction.operations[0][0] == "transfer"){
                var transfer = transaction.operations[0][1];
                if (transfer.to === account) {
                  console.log(transfer);
                  interpreter.onVacancyTransaction(transfer.from, transfer.amount, transfer.memo);
                }
              }
            }
        })
        .on('end', function() {
            // done
            console.log('END');
        });
}
//catch error messages
main().catch(console.error);
