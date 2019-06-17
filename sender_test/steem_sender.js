const dsteem = require('dsteem')
const client = new dsteem.Client('https://anyx.io')

require('dotenv-safe').config();

const account = process.env.ACCOUNT
const active_key = process.env.ACTIVE_KEY

const custom_json = (my_id, my_data) => {
    const key = dsteem.PrivateKey.fromString(active_key)

    client.broadcast.json({
        required_auths: [],
        required_posting_auths: [account],
        id: my_id,
        json: JSON.stringify(my_data),
    }, key).then(
        result => { console.log(result) },
        error => { console.error(error) }
    )
}

function transfer(to, amount, memo) {
  const transf = new Object();
  transf.from = account;
  transf.to = to;
  transf.amount = amount;
  transf.memo = memo;
  const key = dsteem.PrivateKey.fromString(active_key)
  client.broadcast.transfer(transf, key).then(
    function(result) {
        console.log(
            'included in block: ' + result.block_num,
            'expired: ' + result.expired
        );
    },
    function(error) {
        console.error(error);
    }
);
}

module.exports.log = custom_json;
module.exports.transfer = transfer;

custom_json('institutionList', {command: 'create'})
/*custom_json('institutionList', {id: 'idtest', command: 'requestInstitutionRegister'})
custom_json('institutionList', {id: 'idtest', command: 'voteInstitution', target: 'target', vote: true})
custom_json('institutionList', {id: 'idtest', command: 'registerReviewer', target: 'target'})
custom_json('institutionList', {id: 'idtest', command: 'unregisterReviewer'})


custom_json('vacancy', {command: 'create'})
custom_json('vacancy', {id: 'idtest', command: 'registerApplicant'})// check transactions
custom_json('vacancy', {id: 'idtest', command: 'unregisterApplicant'})
custom_json('vacancy', {id: 'idtest', command: 'closeApplicationPhase'})
custom_json('vacancy', {id: 'idtest', command: 'sendReview', target: 'target', reviewPhase: 1})
custom_json('vacancy', {id: 'idtest', command: 'sendHash', target: 'target', reviewPhase: 1, grade: 100})
custom_json('vacancy', {id: 'idtest', command: 'nextReviewPhase'})
custom_json('vacancy', {id: 'idtest', command: 'closeReviewPhase'})
*/
