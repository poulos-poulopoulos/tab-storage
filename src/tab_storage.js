const sep_out = '||', sep_in = '|', menu = 'Window';

function SaveTabs(){
  global.tabs = app.trustedFunction(()=>{
    app.beginPriv();
    const d = app.activeDocs;
    app.endPriv();
    return d;
  })().map(d=>[d.path, d.viewState.toSource()].join(sep_in)).join(sep_out);
  global.setPersistent('tabs', true);
}

function OpenTabs(){
  if(!global.tabs) return;
  global.tabs.split(sep_out).forEach(pv=>{
    const [p, v] = pv.split(sep_in);
    try{
      app.trustedFunction(()=>{
        app.beginPriv();
        const d = app.openDoc(p);
        app.endPriv();
        return d;
      })().viewState = eval(v);
    }
    catch(e){
      app.alert('this file cannot be opened:\n' + p, 3);
    }
  });
}

function ToggleStartupTabs(){
  global.startup_tabs = !global.startup_tabs;
  global.setPersistent('startup_tabs', true);
}

app.addMenuItem({
  cName: '-',
  cParent: menu,
  cExec: 'undefined;'
});

app.addMenuItem({
  cName: 'S&ave Tabs',
  cParent: menu,
  cExec: 'SaveTabs();'
});

app.addMenuItem({
  cName: '&Open Tabs',
  cParent: menu,
  cExec: 'OpenTabs();'
});

app.addMenuItem({
  cName: 'Opening Tabs on Sta&rtup',
  cParent: menu,
  cExec: 'ToggleStartupTabs();',
  cMarked: 'event.rc = global.startup_tabs;'
});

if(global.startup_tabs) OpenTabs();
