import beem
from beem.rc import RC
from beembase import operations

client = beem.Steem()

rc = RC(steem_instance=client)

# print(rc.comment()) #(self, tx_size=1000, permlink_length=10, parent_permlink_length=10)
# print(rc.vote()) #(self, tx_size=210)
# print(rc.transfer()) #(self, tx_size=290, market_op_count=1)
# print(rc.custom_json())

account = "hrm-user"

json = {'command': 'create'}
# json = {
#     'command': 'confirmation',
#     'transaction': '33715240:24',
#     'status': 'OK'
#     }

id = "institutionList"

op = operations.Custom_json(
            **{
                "json": json,
                "required_auths": [],
                "required_posting_auths": [account],
                "id": id
            })

custom_tx = rc.get_tx_size(op)

custom_json_RC_costs = rc.custom_json(custom_tx)

print(custom_json_RC_costs)
