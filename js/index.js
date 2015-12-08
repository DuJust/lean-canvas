$(function () {
  var leanCanvas = (function () {
    var _toggleSectionIndex = function () {
      $('.section-body').each(function () {
        var existItemList = $(this).find('li').length === 0;

        $(this).find('.section-index').toggle(existItemList);
        $(this).find('.section-title-introduction').toggle(existItemList);
      });
    };

    var _clearAllInput = function () {
      $('.item-container').remove();
    };

    var _inputTemplate = ['<li class="item-container">',
      '<div class="item-input-container">',
      '<div><input type="text" class="item-input" name="item-input" value="${name}" /></div>',
      '<div><input type="button" class="submit" value="保存" /><em>/</em><input type="button" class="cancel" value="取消" /></div>',
      '</div>',
      '</li>'
    ].join('');

    var _appendInputItem = function (itemList) {
      _clearAllInput();
      $(itemList).find('.item-container').remove();
      $.tmpl(_inputTemplate, {name: ''}).appendTo(itemList);
      _initInputListener();
      _toggleSectionIndex();
    };

    var _cancelItemWrap = function (itemWrap) {
      $(itemWrap).remove();
      _toggleSectionIndex();
    };

    var _initInputListener = function () {
      $('.item-container').each(function () {
        var itemWrap = this;
        var itemList = $(itemWrap).parent();
        $(this).find('.item-input').focus().keypress(function (event) {
          var key = event.which;
          if (key === 13) {
            _appendShowItem(itemList);
          }
        });
        $(this).find('.submit').click(function (event) {
          event.stopPropagation();
          _appendShowItem(itemList);
        });
        $(this).find('.cancel').click(function (event) {
          event.stopPropagation();
          _cancelItemWrap(itemWrap);
        });
      });
    };

    var _showTemplate = [
      '<li class="section-item container-fluid">',
      '<div class="row-flow">',
      '<div class="span10 text-left section-item-content">${name}</div>',
      '<div class="span2 section-item-delete">',
      '<a class="delete" href="javascript:{}"></a>',
      '</div>',
      '</div>',
      '</li>'
    ].join('');

    var _appendShowItem = function (itemList) {
      var name = $(itemList).find('.item-input').first().val();
      if (name && name !== '') {
        var itemWrap = $(itemList).find('.item-container');
        if (itemWrap.size() > 0) {
          itemWrap.replaceWith($($.tmpl(_showTemplate, {name: name})));
        } else {
          $.tmpl(_showTemplate, {name: name}).appendTo(itemList);
        }
        _appendInputItem(itemList);
      } else {
        $(itemList).remove();
      }
      _toggleSectionIndex();
      _initShowItem();
    };

    var _initDelItem = function () {
      $('.delete').unbind('click').click(function (event) {
        event.stopPropagation();
        $(this).parents('.section-item').remove();
        _clearAllInput();
        _toggleSectionIndex();
        _initShowItem();
      });
    };

    var _initEditItem = function () {
      $('.section-item-content').unbind('click').click(function (event) {
        event.stopPropagation();
        _clearAllInput();
        var name = $(this).html();
        $(this).parents('.section-item').replaceWith($($.tmpl(_inputTemplate, {name: name})));
        _initInputListener();
        _toggleSectionIndex();
      });
    };

    var _initShowItem = function () {
      $('.item-list').sortable().disableSelection();
      _initEditItem();
      _initDelItem();
    };

    var _initFeed = function () {
      $('.section-comment').click(function (event) {
        event.stopPropagation();
        $('<div></div>').html([
          '<div><textarea style="width:240px;height:90px;line-height:16px;"></textarea></div>',
          '<div><input type="button" value="提交" /></div>'
        ].join('')).dialog({
          autoOpen: false,
          title: '发表评论'
        }).dialog('open');
      })
    };

    var init = function () {
      $('.section-body').click(function (event) {
        event.stopPropagation();
        _appendInputItem($(this).find('.item-list'));
      });
      _initShowItem();
      _initFeed();
    };

    return {
      init: init
    };
  }).call(this);

  leanCanvas.init();
});
