$(function () {
  var leanCanvas = (function () {
    var _inputTemplate = [
      '<li class="item-container">',
      '<div class="item-input-container">',
      '<div><input type="text" class="item-input" name="item-input" value="${name}" /></div>',
      '<div><input type="button" class="submit" value="保存" /><em>/</em><input type="button" class="cancel" value="取消" /></div>',
      '</div>',
      '</li>'
    ].join('');

    var _clearAllInput = function () {
      $('.item-container').remove();
    };

    var _toggleSectionIndex = function () {
      $('.section-body').each(function () {
        var existItemList = $(this).find('li').length === 0;

        $(this).find('.section-index').toggle(existItemList);
        $(this).find('.section-title-introduction').toggle(existItemList);
      });
    };

    var _cancelItemContainer = function (itemContainer) {
      $(itemContainer).remove();
      _toggleSectionIndex();
    };

    var _initInputListener = function () {
      $('.item-container').each(function () {
        var itemContainer = this;
        var itemList = $(itemContainer).parent();
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
          _cancelItemContainer(itemContainer);
        });
      });
    };

    var _appendInputItem = function (itemList) {
      _clearAllInput();
      $(itemList).find('.item-container').remove();
      $.tmpl(_inputTemplate, {name: ''}).appendTo(itemList);
      _initInputListener();
      _toggleSectionIndex();
    };

    var _showTemplate = [
      '<li class="section-item container-fluid">',
      '<div class="row-flow">',
      '<div class="text-left section-item-content">${name}</div>',
      '<div class="section-item-delete">',
      '<span class="delete glyphicon glyphicon-trash"></span>',
      '</div>',
      '</div>',
      '</li>'
    ].join('');

    var _appendShowItem = function (itemList) {
      var name = $(itemList).find('.item-input').first().val();
      if (name && name !== '') {
        var itemContainer = $(itemList).find('.item-container');
        var itemTemplate = $.tmpl(_showTemplate, {name: name});
        if (itemContainer.size() > 0) {
          itemContainer.replaceWith($(itemTemplate));
        } else {
          itemTemplate.appendTo(itemList);
        }
        _appendInputItem(itemList);
      } else {
        $(itemList).remove();
      }
      _toggleSectionIndex();
      _initShowItem();
    };

    var _initDeleteItem = function () {
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
        var sectionItem = $.tmpl(_inputTemplate, {name: name});
        $(this).parents('.section-item').replaceWith($(sectionItem));
        _initInputListener();
        _toggleSectionIndex();
      });
    };

    var _initShowItem = function () {
      $('.item-list').sortable().disableSelection();
      _initEditItem();
      _initDeleteItem();
    };

    return {
      init: function () {
        $('.section-body').click(function (event) {
          event.stopPropagation();
          _appendInputItem($(this).find('.item-list'));
        });
        _initShowItem();
      }
    };
  }).call(this);

  leanCanvas.init();
});
