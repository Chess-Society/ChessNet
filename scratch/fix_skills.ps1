$c = Get-Content 'src/routes/panel/skills/create/+page.svelte'
$c1 = $c[0..452]
$c2 = $c[645..($c.Length - 1)]
($c1 + '      <!-- Tips Section -->' + $c2) | Set-Content 'src/routes/panel/skills/create/+page.svelte'
