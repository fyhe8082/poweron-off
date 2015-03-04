## Usage
用于远程操作服务器开机关机


## 服务器程序部署
####安装node(node-v0.10.35.tar)
源码文件在打包文件内

    sudo tar xvf node-v0.10.35.tar
    cd node-v0.10.35
    sudo ./configure
    sudo make
    sudomake install
    sudo cp /usr/local/bin/node /usr/sbin/

查看当前安装的Node的版本

    node -v
v0.10.35

####配置mysql数据库

    vim shutdown/models/conn.js
password port修改为当前机器参数
password为mysql的密码
port 可在进入mysql后，使用show variables like 'port';查看

    mysql -uroot -p
    create database machine;
    use machine;

    CREATE TABLE machine(
    machine_id INT PRIMARY KEY AUTO_INCREMENT,
    machine_ip VARCHAR(16) NOT NULL ,
    machine_user VARCHAR(16) NOT NULL ,
    machine_pwd VARCHAR(16) NOT NULL ,
    ssh_port varchar(16) default "8822",
    machine_mac varchar(20),
    machine_location varchar(16),
    machine_os varchar(16),
    machine_poweroff char(1) default '1'
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;

    CREATE UNIQUE INDEX t_quiz_IDX_0 on machine(machine_id);

    insert into machine(machine_ip,machine_user,machine_pwd,ssh_port,machine_mac,machine_location,machine_os) values ('192.168.99.208','prod','zykie2.0','8822',"D8:D3:85:DC:09:2E","R2-29(1U)","centOS");

_按以上格式插入数据，mac_location和machine_os以外,其他都必填，
machine_ip  _ip地址，格式如上
machine_user _ssh登录的用户名，该用户需要在sudoer中
machine_pwd _该用户的密码
ssh_port  _ssh端口号
machine_mac  _每台机器的MAC地址是eth0的地址可通过ifconfig查看。

####
配置程序模块

    cd shutdown
    sudo npm install
    sudo apt-get install wakeonlan

启动程序：

    sudo npm install -g  pm2@0.9.6
在shutdown目录下

    sudo pm2 start app.js -i max --name "api"
程序默认在8000端口
关闭程序：

    sudo pm2 kill

备用启动方案：

    sudo npm install -g supervisor
    sudo supervisor app.js
使用ctrl-c退出

##客户机配置
1. 正常情况下，BIOS是默认wanonlan功能打开的
2. 若操作后无法启动，需要对客户机进行BIOS设置，进入BIOS的Power Management Setup，设置PME Event Wake Up(这其实是一种Wake On PCI Card模式)为 Enabled。注意，有些机器可能为Wake On Lan或Wake On PCI Card。Wake On Lan模式可以在完全关机状态下唤醒，而Wake On PCI Card模式要在深度休眠状态下唤醒。造成这样的区别主要是因为主板的设计不一样，现在的计算机一般都是Wake On PCI Card模式的。
注：公司这边的服务器全部都是wakeonlan模式，而且设置不在Power Management中，需要自行需找，关键字是wanonlan。

### Tools

Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))

Nodeclipse is free open-source project that grows with your contributions.
