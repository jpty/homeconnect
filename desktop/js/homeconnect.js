
/* This file is part of Jeedom.
 *
 * Jeedom is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Jeedom is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Jeedom. If not, see <http://www.gnu.org/licenses/>.
 */
 $('#bt_deleteEqLogic').on('click', function () {
	bootbox.confirm('{{Cette action supprimera tous les appareils. Faites une synchronisation pour les re-créer}}', function(result) {
		if (result) {
			$.ajax({// fonction permettant de faire de l'ajax
				type: "POST", // methode de transmission des données au fichier php
                url: "plugins/homeconnect/core/ajax/homeconnect.ajax.php", // url du fichier php
                data: {
                    action: "deleteEqLogic",
                },
                dataType: 'json',
                error: function (request, status, error) {
                    handleAjaxError(request, status, error);
                },
                success: function (data) { // si l'appel a bien fonctionné
                    if (data.state != 'ok') {
                        $.fn.showAlert({message: data.result, level: 'danger'});
                        return;
                    }
                    $.fn.showAlert({message: '{{Suppression effectuée}}', level: 'success'});
                    location.reload();
                }
	        });
        }
    });
 });

function syncHC(force = false) {

	$.ajax({ // fonction permettant de faire de l'ajax
		type: "POST", // methode de transmission des données au fichier php
		url: "plugins/homeconnect/core/ajax/homeconnect.ajax.php", // url du fichier php
		data: {
			action: "syncHomeConnect",
			force: force,
		},
		dataType: 'json',
		error: function (request, status, error) {
			handleAjaxError(request, status, error);
		},
		success: function (data) { // si l'appel a bien fonctionné
			if (data.state != 'ok') {
				$.fn.showAlert({message: data.result, level: 'danger'});
				return;
			}
			$.fn.showAlert({message: '{{Synchronisation réussie}}', level: 'success'});
			location.reload();
		}
	});
}

 $('#bt_syncHomeConnect').on('click', function () {
	bootbox.dialog({
      title: '{{Synchronisation}}',
      message: '<p>{{Vos appareils doivent être allumés, WiFi activé et sans programme en cours.}}</p>{{Oui : Ne récupère que la liste des appareils et des commandes de fichier de configuration}}<br/>{{Forcer : consomme beaucoup de requêtes pour récupérer à nouveau tous les programmes et options}}',
      buttons: {
          confirm: {
              label: '<i class="fa fa-check"></i> {{Oui}}',
              className: 'btn-success',
              callback: function(){
                  syncHC(false);
              }
          },
          force: {
              label: '<i class="fas fa-check-double"></i> {{Forcer}}',
              className: 'btn-success',
              callback: function(){
                  syncHC(true);
              }
          },
          cancel: {
              label: '<i class="fa fa-times"></i> {{Annuler}}',
              className: 'btn btn-danger'
          },
        }
	});
});

$('#bt_healthHomeConnect').on('click', function () {
	$('#md_modal').dialog({title: "{{Santé Home Connect}}"});
	$('#md_modal').load('index.php?v=d&plugin=homeconnect&modal=health').dialog('open');
});

$('body').delegate('.cmdAttr[data-action=configureCommand]', 'click', function() {
    $('#md_modal').dialog({
        title: "{{Configuration de la commande}}"
    });
    $('#md_modal').load('index.php?v=d&plugin=homeconnect&modal=command.configure&id=' + $(this).closest('.cmd').getValues('.cmdAttr')[0]['id']).dialog('open');
});

$('.cmdAction[data-action=addCommand]').on('click', function() {
    $('#md_modal').dialog({
        title: "{{Assistant de création de commande}}"
    });
    $('#md_modal').load('index.php?v=d&plugin=homeconnect&modal=addCommand&eqLogic_id='+$('.eqLogicAttr[data-l1key=id]').value()).dialog('open');
});

$('.eqLogicAttr[data-l1key=configuration][data-l2key=type]').on('change',function(){
    if($(this).value() == null){
	    return;
    }
	$('#img_device').attr("src", 'plugins/homeconnect/core/config/images/'+$(this).value()+'.png');
});

$("#table_cmd").sortable({axis: "y", cursor: "move", items: ".cmd", placeholder: "ui-state-highlight", tolerance: "intersect", forcePlaceholderSize: true});
/*
 * Fonction pour l'ajout de commande, appellé automatiquement par plugin.template
 */
function addCmdToTable(_cmd) {
  if (!isset(_cmd)) {
    var _cmd = {configuration: {}};
  }
  if (!isset(_cmd.configuration)) {
    _cmd.configuration = {};
  }
  var tr = '<tr class="cmd" data-cmd_id="' + init(_cmd.id) + '">'
  tr += '<td class="hidden-xs">'
  tr += '<span class="cmdAttr" data-l1key="id"></span>'
  tr += '</td>'
  tr += '<td>'
  tr += '    <div class="input-group">'
  tr += '        <input class="cmdAttr form-control input-sm roundedLeft" data-l1key="name" placeholder="{{Nom de la commande}}">'
  tr += '        <span class="input-group-btn"><a class="cmdAction btn btn-sm btn-default" data-l1key="chooseIcon" title="{{Choisir une icône}}"><i class="fas fa-icons"></i></a></span>'
  tr += '        <span class="cmdAttr input-group-addon roundedRight" data-l1key="display" data-l2key="icon" style="font-size:19px;padding:0 5px 0 0!important;"></span>'
  tr += '    </div>'
  tr += '    <select class="cmdAttr form-control input-sm" data-l1key="value" style="display:none;margin-top:5px;max-width:50%;float:right;" title="{{Commande info liée}}">'
  tr += '        <option value="">{{Aucune}}</option>'
  tr += '    </select>'
  tr += '</td>'

  tr += '<td>';
  tr += '    <span><input type="checkbox" class="cmdAttr" data-size="mini" data-l1key="isVisible" checked/> {{Afficher}}<br/></span>';
  tr += '    <span><input type="checkbox" class="cmdAttr" data-l1key="isHistorized"/> {{Historiser}}</span>';
  tr += '</td>';

  tr += '<td>';
  tr += '    <span class="type" type="' + init(_cmd.type) + '" >' + jeedom.cmd.availableType() + '</span>';
  tr += '    <span class="subType" subType="' + init(_cmd.subType) + '"></span>';
  tr += '</td>';

  tr += '<td>';
  if (init(_cmd.subType) == 'numeric') {
    tr += '    <input class="cmdAttr form-control input-sm" data-l1key="configuration" data-l2key="minValue" placeholder="{{Min}}" title="{{Min}}" style="display:inline-block;width: 50px;"></input>';
    tr += '    <input class="cmdAttr form-control input-sm" data-l1key="unite" placeholder="{{Unité}}" title="{{Unité}}" style="display:inline-block;width: 50px;"></input>';
    tr += '    <style>.select {}</style>';
    tr += '    <input class="cmdAttr form-control input-sm" data-l1key="configuration" data-l2key="maxValue" placeholder="{{Max}}" title="{{Max}}" style="width: 50px;"></input>';
  }
  if (init(_cmd.subType) == 'select') {
    tr += '    <input class="cmdAttr form-control input-sm" data-l1key="configuration" data-l2key="listValue" placeholder="{{Liste de valeur|texte séparé par ;}}" title="{{Liste}}">';
  }
  if (['select', 'slider', 'color'].includes(init(_cmd.subType)) || init(_cmd.configuration.updateCmdId) != '') {
    tr += '    <select class="cmdAttr form-control input-sm" data-l1key="configuration" data-l2key="updateCmdId" title="{{Commande d\'information à mettre à jour}}">';
    tr += '        <option value="">Aucune</option>';
    tr += '    </select>';
    tr += '    <input class="tooltips cmdAttr form-control input-sm" data-l1key="configuration" data-l2key="value" placeholder="{{Valeur de l\'information}}">';
  }
  if (init(_cmd.type) == 'info') {
    tr += '<span class="cmdAttr" data-l1key="htmlstate" style="display:block;text-align:center;"></span>';
  }
  tr += '    <input class="tooltips cmdAttr form-control input-sm" data-l1key="logicalId" style="display:none;">';
  tr += '    <input class="tooltips cmdAttr form-control input-sm" data-l1key="configuration" data-l2key="key" style="display:none;">';
  tr += '    <input class="tooltips cmdAttr form-control input-sm" data-l1key="configuration" data-l2key="path" style="display:none;">';
  tr += '    <input class="tooltips cmdAttr form-control input-sm" data-l1key="configuration" data-l2key="category" style="display:none;">';
  tr += '</td>';

  tr += '<td>';
  tr += '<div class="input-group">';
  if (is_numeric(_cmd.id) && _cmd.id != '') {
    tr += '<a class="btn btn-default btn-xs cmdAction roundedLeft" data-action="configure" title="{{Configuration de la commande}} ' + _cmd.type + '"><i class="fa fa-cogs"></i></a>';
    tr += '<a class="btn btn-warning btn-xs cmdAttr" data-action="configureCommand" title="{{Modification de la commande}} ' + _cmd.type + '"><i class="fas fa-wrench"></i></a>';
    tr += '<a class="btn btn-success btn-xs cmdAction" data-action="test" title="{{Tester}}"><i class="fa fa-rss"></i> {{Tester}}</a>';
  }
  tr += '<a class="btn btn-danger btn-xs cmdAction roundedRight" data-action="remove" title="{{Suppression de la commande}} ' + _cmd.type + '"><i class="fas fa-minus-circle"></i></a>';
  tr += '</div>';
  tr += '</td>';
  tr += '</tr>';
  $('#table_cmd tbody').append(tr);
  var tr = $('#table_cmd tbody tr').last()
  jeedom.eqLogic.buildSelectCmd({
    id:  $('.eqLogicAttr[data-l1key=id]').value(),
    filter: {type: 'info'},
    error: function (error) {
      $.fn.showAlert({message: error.message, level: 'danger'})
    },
    success: function (result) {
      tr.find('.cmdAttr[data-l1key=value]').append(result);
      tr.find('.cmdAttr[data-l1key=configuration][data-l2key=updateCmdId]').append(result);
      tr.setValues(_cmd, '.cmdAttr')
      jeedom.cmd.changeType(tr, init(_cmd.subType))
    }
  })
  jeedom.cmd.changeType($('#table_cmd tbody tr:last'), init(_cmd.subType));
}
