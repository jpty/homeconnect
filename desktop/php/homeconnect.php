<?php
if (!isConnect('admin')) {
	throw new Exception('{{401 - Accès non autorisé}}');
}
$plugin = plugin::byId('homeconnect');
sendVarToJS('eqType', $plugin->getId());
$eqLogics = eqLogic::byType($plugin->getId());
?>

<div class="row row-overflow">
	<div class="col-xs-12 eqLogicThumbnailDisplay">
		<legend><i class="fas fa-cog"></i>	{{Gestion}}</legend>
		<div class="eqLogicThumbnailContainer">
			<div class="cursor eqLogicAction logoSecondary" id="bt_syncHomeConnect" >
				<i class="fas fa-sync-alt"></i>
				<br>
				<span>{{Synchronisation}}</span>
			</div>
			<div class="cursor eqLogicAction logoSecondary" data-action="gotoPluginConf" >
				<i class="fas fa-wrench"></i>
				<br>
				<span>{{Configuration}}</span>
			</div>
			<div class="cursor logoSecondary" id="bt_healthHomeConnect">
				<i class="fas fa-medkit"></i>
				<br />
				<span>{{Santé}}</span>
			</div>
		</div>

		<legend><i class="fas fa-table"></i> {{Mes appareils}}</legend>
		<?php
		if (count($eqLogics) == 0) {
			echo '<br><div class="text-center" style="font-size:1.2em;font-weight:bold;">{{Aucun équipement Home Connect trouvé, cliquez sur "Synchronisation" pour commencer}}</div>';
		} else {
			// Champ de recherche
			echo '<div class="input-group" style="margin:5px;">';
			echo '<input class="form-control roundedLeft" placeholder="{{Rechercher}}" id="in_searchEqlogic">';
			echo '<div class="input-group-btn">';
			echo '<a id="bt_resetSearch" class="btn" style="width:30px"><i class="fas fa-times"></i></a>';
			echo '<a class="btn roundedRight hidden" id="bt_pluginDisplayAsTable" data-coreSupport="1" data-state="0"><i class="fas fa-grip-lines"></i></a>';
			echo '</div>';
			echo '</div>';
			// Liste des équipements du plugin
			echo '<div class="eqLogicThumbnailContainer">';
        	foreach ($eqLogics as $eqLogic) {
						$opacity = ($eqLogic->getIsEnable()) ? '' : 'disableCard';
						echo '<div class="eqLogicDisplayCard cursor '.$opacity.'" data-eqLogic_id="' . $eqLogic->getId() . '">';
						echo '    <img src="' . $eqLogic->getImage() . '">';
						echo '    <br\>';
						echo '    <span class="name">' . $eqLogic->getHumanName(true, true) . '</span>';
						echo '    <span class="hiddenAsCard displayTableRight hidden">';
						echo ($eqLogic->getIsVisible() == 1) ? '<i class="fas fa-eye" title="{{Equipement visible}}"></i>' : '<i class="fas fa-eye-slash" title="{{Equipement non visible}}"></i>';
						echo '    </span>';
						echo '</div>';
					}
			echo '</div>';
		}
		?>
	</div>

	<div class="col-xs-12 eqLogic" style="display: none;">
		<div class="input-group pull-right" style="display:inline-flex;">
			<span class="input-group-btn">
				<a class="btn btn-sm btn-default eqLogicAction roundedLeft" data-action="configure"><i class="fas fa-cogs"></i><span class="hidden-xs"> {{Configuration avancée}}</span>
				</a><a class="btn btn-sm btn-success eqLogicAction" data-action="save"><i class="fas fa-check-circle"></i> {{Sauvegarder}}
				</a><a class="btn btn-sm btn-danger eqLogicAction roundedRight" data-action="remove"><i class="fas fa-minus-circle"></i> {{Supprimer}}
				</a>
			</span>
		</div>
		<ul class="nav nav-tabs" role="tablist">
			<li role="presentation"><a href="#" class="eqLogicAction" aria-controls="home" role="tab" data-toggle="tab" data-action="returnToThumbnailDisplay"><i class="fas fa-arrow-circle-left"></i></a></li>
			<li role="presentation" class="active"><a href="#eqlogictab" aria-controls="home" role="tab" data-toggle="tab"><i class="fas fa-tachometer-alt"></i> {{Equipement}}</a></li>
			<li role="presentation"><a href="#commandtab" aria-controls="profile" role="tab" data-toggle="tab"><i class="fas fa-list-alt"></i> {{Commandes}}</a></li>
		</ul>
		<div class="tab-content" style="height:calc(100% - 50px);overflow:auto;overflow-x: hidden;">
			<div role="tabpanel" class="tab-pane active" id="eqlogictab">

				<div class="col-lg-6">
					<legend><i class="fas fa-wrench"></i> {{Paramètres généraux}}</legend>
					<form class="form-horizontal">
						<fieldset>
							<div class="form-group">
								<label class="col-sm-4 control-label">{{Nom de l'équipement}}</label>
								<div class="col-sm-6">
									<input type="text" class="eqLogicAttr form-control" data-l1key="id" style="display:none;">
									<input type="text" class="eqLogicAttr form-control" data-l1key="name" placeholder="{{Nom de l'équipement}}">
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-4 control-label" >{{Objet parent}}</label>
								<div class="col-sm-6">
									<select id="sel_object" class="eqLogicAttr form-control" data-l1key="object_id">
										<option value="">{{Aucun}}</option>
										<?php
										$options = '';
										foreach ((jeeObject::buildTree(null, false)) as $object) {
											$options .= '<option value="' . $object->getId() . '">' . str_repeat('&nbsp;&nbsp;', $object->getConfiguration('parentNumber')) . $object->getName() . '</option>';
										}
										echo $options;
										?>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-4 control-label">{{Catégorie}}</label>
								<div class="col-sm-6">
									<?php
									foreach (jeedom::getConfiguration('eqLogic:category') as $key => $value) {
										echo '<label class="checkbox-inline">';
										echo '<input type="checkbox" class="eqLogicAttr" data-l1key="category" data-l2key="' . $key . '" >' . $value['name'];
										echo '</label>';
									}
									?>
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-4 control-label">{{Options}}</label>
								<div class="col-sm-6">
									<label class="checkbox-inline"><input type="checkbox" class="eqLogicAttr" data-l1key="isEnable" checked>{{Activer}}</label>
									<label class="checkbox-inline"><input type="checkbox" class="eqLogicAttr" data-l1key="isVisible" checked>{{Visible}}</label>
								</div>
							</div>
						</fieldset>
					</form>
				</div>
				<div class="col-lg-6">
					<legend><i class="fas fa-info"></i> {{Informations}}</legend>
					<div class="form-group">
						<div class="col-sm-12">
						    <label class="col-sm-3 control-label">{{Type}}</label>
							<span class="eqLogicAttr label label-info" data-l1key="configuration" data-l2key="type"></span>
						</div>
					</div>
					<div class="form-group">
						<div class="col-sm-12">
						    <label class="col-sm-3 control-label">{{Marque}}</label>
							<span class="eqLogicAttr label label-info" data-l1key="configuration" data-l2key="brand"></span>
						</div>
					</div>

					<div class="form-group">
						<div class="col-sm-12">
						    <label class="col-sm-3 control-label">{{Modèle}}</label>
							<span class="eqLogicAttr label label-info" data-l1key="configuration" data-l2key="vib"></span>
						</div>
					</div>

					<div class="form-group">
						<div class="col-sm-12">
						    <label class="col-sm-3 control-label">{{Identifiant}}</label>
							<span class="eqLogicAttr label label-info" data-l1key="configuration" data-l2key="haid"></span>
						</div>
					</div>
				</div>
				<div class="col-sm-6">
					<form class="form-horizontal">
						<fieldset>
							<div class="form-group">
								<label class="col-sm-2 control-label"></label>
								<div class="col-sm-8">
									<img src="core/img/no_image.gif" data-original=".png" id="img_device" class="img-responsive" style="max-height : 250px;" onerror="this.src='plugins/homeconnect/plugin_info/homeconnect_icon.png'"/>
								</div>
							</div>
						</fieldset>
					</form>
				</div>
			</div>

			<div role="tabpanel" class="tab-pane" id="commandtab">
				<a class="btn btn-success btn-sm cmdAction pull-right" data-action="add" style="margin-top:5px;"><i class="fas fa-plus-circle"></i> {{Commandes}}</a>
				<a class="btn btn-warning btn-sm cmdAction pull-right" data-action="addCommand" style="margin-top:5px;"><i class="fas fa-plus-circle"></i> {{Assistant commande}}</a>
                <br><br>
				<div class="table-responsive">
					<table id="table_cmd" class="table table-bordered table-condensed">
						<thead>
							<tr>
								<th class="hidden-xs" style="min-width:50px;width:70px;">ID</th>
								<th style="min-width:200px;width:450px;">{{Nom}}</th>
								<th>{{Afficher/Historiser}}</th>
								<th>{{Type}}</th>
								<th>{{Paramètres}}</th>
								<th style="min-width:80px;width:150px;">{{Actions}}</th>
							</tr>
						</thead>
						<tbody>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>

<?php include_file('desktop', 'homeconnect', 'js', 'homeconnect');?>
<?php include_file('core', 'plugin.template', 'js');?>
