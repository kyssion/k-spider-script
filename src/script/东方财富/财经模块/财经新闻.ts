import * as get_data from "../util/get_data";
import * as playwright from "playwright";
import * as Url from "url";


const defaultPageNum = 10;

class CjOption {
    public ModuleName:string
    public Url:string;
    public PageNum:number;


    constructor(ModuleName: string, Url: string, PageNum: number) {
        this.ModuleName = ModuleName;
        this.Url = Url;
        this.PageNum = PageNum;
    }
}

let defaultOption:CjOption[] = [
    {
        ModuleName:"导读",
        Url:"https://finance.eastmoney.com/a/ccjdd_{0}.html",
        PageNum:defaultPageNum
    },
    {
        ModuleName:"时评",
        Url:"https://finance.eastmoney.com/a/cjjsp_{0}.html",
        PageNum:defaultPageNum
    },
    {
        ModuleName:"股评",
        Url:"https://finance.eastmoney.com/a/cgspl_{0}.html",
        PageNum:defaultPageNum
    },
    {
        ModuleName:"国内经济",
        Url:"https://finance.eastmoney.com/a/cgnjj_{0}.html",
        PageNum:defaultPageNum
    },
    {
        ModuleName:"证劵聚焦",
        Url:"https://finance.eastmoney.com/a/czqyw_{0}.html",
        PageNum:defaultPageNum
    },
    {
        ModuleName:"国际经济",
        Url:"https://finance.eastmoney.com/a/cgjjj_{0}.html",
        PageNum:defaultPageNum
    },
    {
        ModuleName:"宏观研究",
        Url:"https://finance.eastmoney.com/a/chgyj_{0}.html",
        PageNum:defaultPageNum
    },
    {
        ModuleName:"沪深公司",
        Url:"https://finance.eastmoney.com/a/cssgs_{0}.html",
        PageNum:defaultPageNum
    },
    {
        ModuleName:"港股公司",
        Url:"https://hk.eastmoney.com/a/cgsbd_{0}.html",
        PageNum:defaultPageNum
    },
    {
        ModuleName:"中概股",
        Url:"https://stock.eastmoney.com/a/czggng_{0}.html",
        PageNum:defaultPageNum
    },
    {
        ModuleName:"欧美公司",
        Url:"https://stock.eastmoney.com/a/cmgpj_{0}.html",
        PageNum:defaultPageNum
    },
    {
        ModuleName:"产经咨询",
        Url:"https://finance.eastmoney.com/a/ccjxw_{0}.html",
        PageNum:defaultPageNum
    },
    {
        ModuleName:"商业咨询",
        Url:"https://biz.eastmoney.com/a/csyzx_{0}.html",
        PageNum:defaultPageNum
    },
    {
        ModuleName:"行业研究",
        Url:"https://stock.eastmoney.com/a/chyyj_{0}.html",
        PageNum:defaultPageNum
    },
    {
        ModuleName:"财富观察",
        Url:"https://enterprise.eastmoney.com/a/ccfgc_{0}.html",
        PageNum:defaultPageNum
    },
    {
        ModuleName:"热点扫描",
        Url:"https://finance.eastmoney.com/a/crdsm_{0}.html",
        PageNum:defaultPageNum
    },
    {
        ModuleName:"纵深调查",
        Url:"https://finance.eastmoney.com/a/czsdc_{0}.html",
        PageNum:defaultPageNum
    },
    {
        ModuleName:"产业透视",
        Url:"https://finance.eastmoney.com/a/ccyts_{0}.html",
        PageNum:defaultPageNum
    },
    {
        ModuleName:"商业观察",
        Url:"https://finance.eastmoney.com/a/csygc_{0}.html",
        PageNum:defaultPageNum
    },
    {
        ModuleName:"创业研究",
        Url:"https://enterprise.eastmoney.com/a/ccyyj_{0}.html",
        PageNum:defaultPageNum
    }
]

let  run= async function (){
    let browser = await playwright.chromium.launch(
        {
            headless: true,
        }
    );

    let listUtil = new get_data.DFCFListUtil()
    await browser.close()
}

run().then(() => {});
