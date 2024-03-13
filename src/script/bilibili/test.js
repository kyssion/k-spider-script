fetch("https://chatglm.cn/chatglm/backend-api/assistant/stream", {
    "headers": {
        "accept": "text/event-stream",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
        "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxMDMwMzE3NywianRpIjoiYWUzZGVlNTItMTA5MS00YTEwLTkzYTktODRmYWE5YzlmZGQwIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6Ijk4NzhkODUxMDcxNDQzM2FhZDUyZTYxMjZlZjFkYTQ1IiwibmJmIjoxNzEwMzAzMTc3LCJleHAiOjE3MTAzODk1NzcsInVpZCI6IjY0OTkzZjJkNDIwNDA0NDNmOGE0MjNmMCIsInVwbGF0Zm9ybSI6IiIsInJvbGVzIjpbInVuYXV0aGVkX3VzZXIiXX0.NJyPV1aQtNi0oV4XCEOJSwBNYirilSO71xvsoy2ydAo",
        "cache-control": "no-cache",
        "content-type": "application/json",
        "pragma": "no-cache",
        "sec-ch-ua": "\"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Google Chrome\";v=\"122\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-goofy-env": "qmf_ppe",
        "x-tt-env": "ppe_kyssion_sdk6000",
        "x-use-ppe": "1",
        "cookie": "sensorsdata2015jssdkchannel=%7B%22prop%22%3A%7B%22_sa_channel_landing_url%22%3A%22%22%7D%7D; _ga=GA1.1.1163077665.1703836507; chatglm_refresh_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcwOTUzMjM0NSwianRpIjoiYmZkNWQ4NWQtN2FlYi00MjI4LTgyOTctY2JhZGE4ODMzZTAzIiwidHlwZSI6InJlZnJlc2giLCJzdWIiOiI5ODc4ZDg1MTA3MTQ0MzNhYWQ1MmU2MTI2ZWYxZGE0NSIsIm5iZiI6MTcwOTUzMjM0NSwiZXhwIjoxNzI1MDg0MzQ1LCJ1aWQiOiI2NDk5M2YyZDQyMDQwNDQzZjhhNDIzZjAiLCJ1cGxhdGZvcm0iOiIiLCJyb2xlcyI6WyJ1bmF1dGhlZF91c2VyIl19.klzyn2kCgLnRY2AlP6yCriHUOjyx-NXgnG8_t5ICLqE; chatglm_user_id=64993f2d42040443f8a423f0; acw_tc=6f0db51e17103031767376322e3498323124a14d74172e9b388cac9126; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%2264993f2d42040443f8a423f0%22%2C%22first_id%22%3A%2218cb491db329e9-0b620ba8a14163-1f525637-1296000-18cb491db33146d%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E8%87%AA%E7%84%B6%E6%90%9C%E7%B4%A2%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC%22%2C%22%24latest_referrer%22%3A%22https%3A%2F%2Fwww.google.com%2F%22%2C%22_latest_wx_ad_click_id%22%3A%22%22%2C%22_latest_wx_ad_hash_key%22%3A%22%22%2C%22_latest_wx_ad_callbacks%22%3A%22%22%7D%2C%22identities%22%3A%22eyIkaWRlbnRpdHlfY29va2llX2lkIjoiMThjYjQ5MWRiMzI5ZTktMGI2MjBiYThhMTQxNjMtMWY1MjU2MzctMTI5NjAwMC0xOGNiNDkxZGIzMzE0NmQiLCIkaWRlbnRpdHlfbG9naW5faWQiOiI2NDk5M2YyZDQyMDQwNDQzZjhhNDIzZjAifQ%3D%3D%22%2C%22history_login_id%22%3A%7B%22name%22%3A%22%24identity_login_id%22%2C%22value%22%3A%2264993f2d42040443f8a423f0%22%7D%2C%22%24device_id%22%3A%2218cb491db329e9-0b620ba8a14163-1f525637-1296000-18cb491db33146d%22%7D; chatglm_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxMDMwMzE3NywianRpIjoiYWUzZGVlNTItMTA5MS00YTEwLTkzYTktODRmYWE5YzlmZGQwIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6Ijk4NzhkODUxMDcxNDQzM2FhZDUyZTYxMjZlZjFkYTQ1IiwibmJmIjoxNzEwMzAzMTc3LCJleHAiOjE3MTAzODk1NzcsInVpZCI6IjY0OTkzZjJkNDIwNDA0NDNmOGE0MjNmMCIsInVwbGF0Zm9ybSI6IiIsInJvbGVzIjpbInVuYXV0aGVkX3VzZXIiXX0.NJyPV1aQtNi0oV4XCEOJSwBNYirilSO71xvsoy2ydAo; chatglm_token_expires=2024-03-13%2014:12:57; _ga_PMD05MS2V9=GS1.1.1710303177.9.1.1710303232.0.0.0",
        "Referer": "https://chatglm.cn/main/alltoolsdetail",
        "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": "{\"assistant_id\":\"65940acff94777010aa6b796\",\"conversation_id\":\"65f12843cba383c252fe5c60\",\"meta_data\":{\"is_test\":false,\"input_question_type\":\"xxxx\",\"channel\":\"\",\"draft_id\":\"\"},\"messages\":[{\"role\":\"user\",\"content\":[{\"type\":\"text\",\"text\":\"你是国产之光\"}]}]}",
    "method": "POST"
}).then(rr => {

});
